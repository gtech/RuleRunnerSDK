"""Compatibility shim so existing code can still do `import sdk.client`.

All public symbols are simply re-exported from `rulerunner_sdk.client`.
"""

from rulerunner_sdk.client import (
    RuleRunnerClient,
    RuleRunnerError,
    RuleRunnerAPIError,
    RuleRunnerConnectionError,
    RuleRunnerProofVerificationError,
)  # noqa: F401

# Re-export all other names too – keep * after explicit imports so everything is available.
from rulerunner_sdk.client import *  # noqa: F401,F403,E402

__all__ = [
    "RuleRunnerClient",
    "RuleRunnerError",
    "RuleRunnerAPIError",
    "RuleRunnerConnectionError",
    "RuleRunnerProofVerificationError",
] 