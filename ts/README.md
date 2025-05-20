# RuleRunner TypeScript/JavaScript SDK

Official TypeScript/JavaScript SDK for the RuleRunner API - a compliance-as-a-service platform for blockchain transactions.

## Installation

```bash
npm install @rulerunner/sdk
# or
yarn add @rulerunner/sdk
```

## Quick Start

```typescript
import { RuleRunner } from '@rulerunner/sdk';

// Initialize the client with your API key
const client = new RuleRunner({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.rulerunner.io'
});

// Check if a transaction is compliant
const result = await client.isCompliant({
  from_address: '0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9',
  to_address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44f',
  amount: '10.0'
});

console.log(`Transaction is compliant: ${result.is_compliant}`);

// Verify a proof locally
if (!result.is_compliant && result.from_address_proof) {
  const isValid = await client.verifyProofLocally(
    '0x7FF9cFad3877F21d41Da833E2F775dB0569eE3D9',
    result.from_address_proof,
    result.merkle_root
  );
  console.log(`Local proof verification: ${isValid}`);
}
```

## Features

- Transaction compliance checking
- Local proof verification
- Health check endpoint
- API key management
- Rate limiting and quota tracking

## API Reference

### RuleRunner

```typescript
const client = new RuleRunner({
  apiKey: string,
  baseURL?: string // Optional custom base URL
});
```

### Methods

#### isCompliant

Check if a transaction is compliant with sanctions lists.

```typescript
const result = await client.isCompliant({
  from_address: string,
  to_address: string,
  amount: string
});
```

#### verifyProofLocally

Verify a Merkle proof locally without making an API call.

```typescript
const isValid = client.verifyProofLocally(
  address: string,
  proof: Array<{ position: 'left' | 'right'; hash: string }>,
  root: string
);
```

#### healthCheck

Check the health status of the API.

```typescript
const status = await client.healthCheck();
```

## Error Handling

The SDK throws custom errors for different error cases:

- `RuleRunnerAPIError`: API-level errors (4xx, 5xx)
- `RuleRunnerConnectionError`: Network/connection issues
- `RuleRunnerProofVerificationError`: Invalid proof data

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## License

MIT License 