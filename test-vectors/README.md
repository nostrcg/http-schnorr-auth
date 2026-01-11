# HTTP Schnorr Auth Test Vectors

Test vectors for verifying NIP-98/HTTP Schnorr Auth implementations.

## Usage

Use `vectors.json` to verify your implementation handles all cases correctly:

```javascript
import vectors from './vectors.json';

for (const vector of vectors.vectors) {
  const result = await verifyNIP98Event(vector.event, vector.request);

  if (vector.expected === 'ACCEPT') {
    assert(result.valid === true, `${vector.id} should accept`);
  } else {
    assert(result.valid === false, `${vector.id} should reject`);
  }
}
```

## Test Cases

| # | ID | Description | Expected |
|---|-----|-------------|----------|
| 1 | valid-get-request | Valid GET request | ACCEPT |
| 2 | valid-post-with-payload | Valid POST with payload hash | ACCEPT |
| 3 | invalid-signature | Corrupted signature | REJECT 401 |
| 4 | wrong-kind | Kind 1 instead of 27235 | REJECT 401 |
| 5 | expired-event | Event older than 60 seconds | REJECT 401 |
| 6 | url-mismatch | URL doesn't match request | REJECT 401 |
| 7 | method-mismatch | Method doesn't match request | REJECT 401 |
| 8 | missing-url-tag | Missing required `u` tag | REJECT 401 |
| 9 | missing-method-tag | Missing required `method` tag | REJECT 401 |
| 10 | payload-hash-mismatch | Payload hash doesn't match body | REJECT 401 |

## Regenerating Vectors

For maintainers, to regenerate vectors with fresh timestamps:

```bash
npm install @noble/secp256k1 @noble/hashes
node generate.js > vectors.json
```

## References

- [NIP-98](https://nips.nostr.com/98) - HTTP Auth
- [NIP-01](https://nips.nostr.com/1) - Event serialization
- [BIP-340](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki) - Schnorr Signatures
