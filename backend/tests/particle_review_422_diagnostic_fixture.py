"""Provide one harmless fixture for GitHub review validation diagnostics."""


def diagnostic_fixture_message() -> str:
    """Return a stable synthetic message without using user data.
    사용자 데이터를 사용하지 않고 고정된 합성 메시지를 반환합니다.
    """
    return "synthetic-review-422-diagnostic"
