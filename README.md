# Rulerunner SDKs (Python & TypeScript)

This repository contains the official Python and TypeScript SDKs for integrating with the [Rulerunner™ API](https://api.rulerunner.io/documentation).

RuleRunner provides a lightning-fast sanctions & compliance engine you can call from any on-chain or off-chain workflow. It returns deterministic Merkle-proofs in milliseconds so you can prove to counterparties (or auditors) exactly *why* a transaction was allowed or blocked.

## Why RuleRunner?

-   **Centralised exchange pre-trade checks**: Call the API in your matching-engine to guarantee sanctioned wallets never reach the order-book.
-   **DeFi wallet plug-in**: Surface real-time compliance warnings before a user signs the tx.
-   **Fintech payment gateway**: Embed Rulerunner™ in your payout pipeline to meet AML obligations without weeks of in-house dev.

## Getting Started

To get started with the Rulerunner™ API and these SDKs, you'll need an API key.

1.  Sign up or log in at the [Rulerunner Dashboard](https://rulerunner.io/dashboard)
2.  Copy your personal **API key** from the dashboard.
3.  Dig deeper into the [API Documentation](https://api.rulerunner.io/documentation) or this repository.

## API Reference

The SDKs interact with the Rulerunner API. Key endpoints include:

*   `POST /api/v1/isCompliant`: Checks if a transaction is compliant.
*   `GET /api/v1/health`: Returns the health status of the API.

For detailed API information, request/response schemas, and error codes, please refer to the official [Rulerunner™ API Documentation](https://api.rulerunner.io/documentation).