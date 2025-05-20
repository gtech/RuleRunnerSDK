import os

# ---------------------------------------------------------------------------
# Test harness helper: Ensure that the integration tests located in
# `sdk/tests/test_integration.py` are **skipped** when no real production API
# key is available.  The test file does this:
#
#     REAL_API_KEY = os.getenv("RULERUNNER_PROD_API_KEY")
#     if not REAL_API_KEY or REAL_API_KEY == "your_actual_api_key_for_testing_prod_or_staging":
#         pytest.skip(...)
#
# During automated CI runs we obviously don't want to hit the live API, and
# most developers won't have a prod key either.  By populating the environment
# variable with the sentinel placeholder *only when it is missing*, we make
# sure the condition in the fixture evaluates to `True` so the tests are
# skipped.
# ---------------------------------------------------------------------------

# Set a placeholder prod key so integration tests skip when no real key present.
os.environ.setdefault(
    "RULERUNNER_PROD_API_KEY", "your_actual_api_key_for_testing_prod_or_staging"
) 