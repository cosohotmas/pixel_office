"""Verify the review budget and GitHub submission with a fake clock.
모의 시계로 리뷰 예산과 GitHub 제출을 확인합니다.
"""

import contextlib
import io
import unittest
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from unittest.mock import patch

# Load the repository-level script from the backend test runner.
# 백엔드 테스트 실행기에서 저장소 루트의 스크립트를 불러옵니다.
script = Path(__file__).resolve().parents[2] / "scripts" / "particle_review.py"
spec = spec_from_file_location("particle_review", script)
review = module_from_spec(spec)
spec.loader.exec_module(review)


class ReviewBudgetTest(unittest.TestCase):
    def run_review(self, preparation, *, changed=False, submission_fails=False):
        clock = [0]
        head = {"sha": "original", "repo": {"full_name": "example/repo"}}
        pull = {"state": "open", "base": {"ref": "main"}, "head": head}

        def github(*args, operation, **kwargs):
            if operation == "latest_sha_lookup":
                return {"head": {"sha": "changed" if changed else head["sha"]}}
            if operation == "review_submission" and submission_fails:
                raise review.ReviewError("Simulated GitHub submission failure.")
            return pull if operation == "pull_request_lookup" else []

        def get_diff(*args):
            clock[0] += preparation
            return "diff --git a/test.py b/test.py\n+++ b/test.py\n"

        def model(*args):
            clock[0] += args[-1]
            raise review.ReviewError("Model attempt timed out.", "attempt_timeout")

        stderr = io.StringIO()
        with (
            patch.dict(review.os.environ, {
                "GITHUB_TOKEN": "mock-token",
                "OPENROUTER_API_KEY": "mock-key",
                "GITHUB_REPOSITORY": "example/repo",
                "PULL_REQUEST_NUMBER": "1",
            }),
            patch.object(review, "configured_models", return_value=["first", "second", "third"]),
            patch.object(review.time, "monotonic", side_effect=lambda: clock[0]),
            patch.object(review, "request_json", side_effect=github) as requests,
            patch.object(review, "get_diff", side_effect=get_diff),
            patch.object(review, "run_model_attempt", side_effect=model) as attempts,
            contextlib.redirect_stdout(io.StringIO()),
            contextlib.redirect_stderr(stderr),
        ):
            result = review.main()
        timeouts = [call.args[-1] for call in attempts.call_args_list]
        posts = [call.kwargs["payload"] for call in requests.call_args_list if call.kwargs.get("method") == "POST"]
        return result, timeouts, posts, stderr.getvalue()

    def test_fast_preparation_allows_full_model_budget(self):
        result, timeouts, posts, _ = self.run_review(15)
        self.assertEqual((result, timeouts), (0, [60, 60]))
        self.assertEqual(len(posts), 1)
        self.assertIn("120 seconds", posts[0]["body"])

    def test_slow_preparation_preserves_submission_time(self):
        result, timeouts, posts, _ = self.run_review(95)
        self.assertEqual((result, timeouts), (0, [60, 15]))
        self.assertEqual(len(posts), 1)
        self.assertIn("reserve time", posts[0]["body"])
        self.assertEqual(posts[0]["event"], "COMMENT")

    def test_no_model_time_still_submits_comment(self):
        result, timeouts, posts, _ = self.run_review(170)
        self.assertEqual((result, timeouts), (0, []))
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0]["commit_id"], "original")
        self.assertEqual(posts[0]["event"], "COMMENT")
        self.assertIn("reserve time", posts[0]["body"])

    def test_changed_head_skips_submission(self):
        result, _, posts, error = self.run_review(170, changed=True)
        self.assertEqual((result, posts), (1, []))
        self.assertIn("changed during review", error)

    def test_submission_failure_is_reported_without_retry(self):
        result, _, posts, error = self.run_review(170, submission_fails=True)
        self.assertEqual((result, len(posts)), (1, 1))
        self.assertIn("Simulated GitHub submission failure", error)
