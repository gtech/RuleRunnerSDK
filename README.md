# RuleRunner SDKs (Python & TypeScript)

This repository contains the official Python and TypeScript SDKs for integrating with the [RuleRunner API](https://api.rulerunner.io/documentation).

RuleRunner provides a lightning-fast sanctions & compliance engine you can call from any on-chain or off-chain workflow. It returns deterministic Merkle-proofs in milliseconds so you can prove to counterparties (or auditors) exactly *why* a transaction was allowed or blocked.

## Why RuleRunner?

-   **Centralised exchange pre-trade checks**: Call the API in your matching-engine to guarantee sanctioned wallets never reach the order-book.
-   **DeFi wallet plug-in**: Surface real-time compliance warnings before a user signs the tx.
-   **Fintech payment gateway**: Embed RuleRunner in your payout pipeline to meet AML obligations without weeks of in-house dev.

## Getting Started

To get started with the RuleRunner API and these SDKs, you'll need an API key.

1.  Sign up or log in at the [RuleRunner Dashboard](https://rulerunner.io/dashboard)
2.  Copy your personal **API key** from the dashboard.

API requests are authenticated using an API key passed in the `X-API-Key` header.

## Python SDK

We provide a Python SDK for easy integration.

**Installation:**

```bash
pip install rulerunner-sdk
```

**Example Usage:**

```python
from rulerunner_sdk import RuleRunnerClient

# Initialize the client with your API key
client = RuleRunnerClient(api_key="YOUR_API_KEY")

# Check if a transaction is compliant
result = client.is_compliant(
    from_address="0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9",
    to_address="0x742d35Cc6634C0532925a3b844Bc454e4438f44f",
    amount="1.0"
)

print(f"Transaction is compliant: {result['is_compliant']}")
print("--------------------------------")
# Example of accessing other fields, e.g., entity details if available
# print(result.get("from_entity_details"))
print("--------------------------------")

# Verify a proof locally
if not result['is_compliant'] and result.get('from_address_proof'):
    is_valid = client.verify_proof_locally(
        address="0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9",
        proof=result.get("from_address_proof"),
        root=result['merkle_root']
    )
    print(f"Local proof verification: {is_valid}")
```

## TypeScript / JavaScript SDK

A lightweight TypeScript/JavaScript SDK is available on npm.

**Installation:**

```bash
npm install @rulerunner/sdk
```

**Example Usage:**

```typescript
import { RuleRunner } from "@rulerunner/sdk";

// Initialize the client with your API key
const client = new RuleRunner({
  apiKey: "YOUR_API_KEY"
});

async function checkCompliance() {
  // Check if a transaction is compliant
  const result = await client.isCompliant({
    from_address: "0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9",
    to_address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44f",
    amount: "10.0"
  });

  console.log(`Transaction is compliant: ${result.is_compliant}`);

  // Verify a proof locally
  if (!result.is_compliant && result.from_address_proof) {
    const isValid = await client.verifyProofLocally(
      "0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9",
      result.from_address_proof,
      result.merkle_root
    );
    console.log(`Local proof verification: ${isValid}`);
  }
}

checkCompliance();
```

## API Reference

The SDKs interact with the RuleRunner API. Key endpoints include:

*   `POST /api/v1/isCompliant`: Checks if a transaction is compliant.
*   `GET /api/v1/health`: Returns the health status of the API.

For detailed API information, request/response schemas, and error codes, please refer to the official [RuleRunner API Documentation](https://api.rulerunner.io/documentation).