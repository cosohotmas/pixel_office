"""Provide one harmless fixture for GitHub review validation diagnostics."""


def diagnostic_fixture_message() -> str:
    """Return a stable synthetic message without using user data.
    사용자 데이터를 사용하지 않고 고정된 합성 메시지를 반환합니다.
    """
    return "synthetic-review-422-diagnostic"


def diagnostic_probe_label() -> str:
    """Return a second stable label for the post-merge diagnostic probe.
    merge 후 진단 probe를 위한 두 번째 고정 라벨을 반환합니다.
    """
    return "synthetic-review-422-probe"
