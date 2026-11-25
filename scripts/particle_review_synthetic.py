"""Run a bounded synthetic model failover check and optional Slack receipt test."""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

from particle_review import ReviewError, ask_particle, configured_models


SYNTHETIC_DIFF = """diff --git a/synthetic/review-fixture.py b/synthetic/review-fixture.py
index 1111111..2222222 100644
--- a/synthetic/review-fixture.py
+++ b/synthetic/review-fixture.py
@@ -1,3 +1,4 @@
 def calculate_total(items):
-    return sum(items)
+    return sum(items) / len(items)
"""


def send_synthetic_slack(webhook_url: str, channel: str, model: str, summary: str) -> None:
    """Send only a bounded synthetic result to Slack.
    제한된 합성 결과만 Slack으로 보냅니다.
    """
    message = (
        "*Particle synthetic failover check*\n"
        f"Model: `{model}`\n"
        f"Channel: `{channel}`\n"
        "No repository PR or review event was created.\n\n"
        f"{summary[:2_000]}"
    )
    request = urllib.request.Request(
        webhook_url,
        data=json.dumps({"channel": channel, "text": message}).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "particle-synthetic-check"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        if not 200 <= response.status < 300:
            raise ReviewError(f"Slack webhook returned HTTP {response.status}.")
        print(f"Synthetic Slack notification returned HTTP {response.status}.")


def main() -> int:
    """Run the synthetic model check without touching GitHub review APIs."""
    if os.environ.get("SYNTHETIC_CONFIRMATION") != "SEND_SYNTHETIC_SLACK_TEST":
        print("Synthetic confirmation is missing; refusing to run.", file=sys.stderr)
        return 2

    api_key = os.environ.get("OPENROUTER_API_KEY", "")
    webhook_url = os.environ.get("SLACK_WEBHOOK_URL", "")
    channel = os.environ.get("SLACK_CHANNEL_NAME", "#pixel_office")
    if not api_key:
        print("OPENROUTER_API_KEY is missing; refusing to call a model.", file=sys.stderr)
        return 2
    if not webhook_url:
        print("SLACK_WEBHOOK_URL is missing; refusing to claim Slack verification.", file=sys.stderr)
        return 2

    failures = []
    for model in configured_models():
        try:
            review = ask_particle(api_key, "Synthetic Particle review fixture", SYNTHETIC_DIFF, model)
            print(f"Synthetic review succeeded with configured model {model}.")
            send_synthetic_slack(webhook_url, channel, model, review["summary"])
            return 0
        except (ReviewError, urllib.error.URLError) as error:
            failures.append(f"{model}: {error}")
            print(f"Synthetic model failed: {model}: {error}; trying the next configured model.")

    print("All configured synthetic models failed:", file=sys.stderr)
    for failure in failures:
        print(f"- {failure}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
