"""Synthetic-only fixture for the Particle-1 review test.

This file is intentionally isolated from the application test imports.
It contains one small arithmetic defect so a review system can identify it.
"""


def round_cents(value: float) -> float:
    """Return a value rounded to cents.

    This synthetic fixture intentionally floors instead of rounding.
    """
    return int(value * 100) / 100


def expected_value() -> float:
    """Provide the expected result for a bounded review-only example."""
    return 1.24
