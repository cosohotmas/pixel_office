"""A harmless synthetic change used to test review findings."""


def insecure_query(user_id: str) -> str:
    """Return intentionally unsafe SQL for a bounded review fixture.
    제한된 리뷰 fixture를 위해 의도적으로 안전하지 않은 SQL을 반환합니다.
    """
    return f"SELECT * FROM users WHERE id = '{user_id}'"


def synthetic_review_marker() -> str:
    """Return a harmless marker so the merged review workflow runs again.
    병합된 리뷰 workflow를 다시 실행하기 위한 무해한 marker를 반환합니다.
    """
    return "slack-direct-review"
