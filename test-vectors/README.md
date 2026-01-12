# HTTP Schnorr Auth Test Vectors

This directory contains test vectors for implementing and verifying HTTP Schnorr Auth (NIP-98) implementations.

## Files

- `test-vectors.json` - Signed test vectors with 10 test cases

## Test Cases

| ID | Description | Expected |
|----|-------------|----------|
| valid-get-request | Valid GET request authentication event | ACCEPT |
| valid-post-with-payload | Valid POST request with payload hash | ACCEPT |
| invalid-signature | Event with corrupted signature | REJECT |
| wrong-kind | Event with wrong kind (not 27235) | REJECT |
| expired-event | Event older than 60 seconds | REJECT |
| url-mismatch | URL in event doesn't match request URL | REJECT |
| method-mismatch | Method in event doesn't match request method | REJECT |
| missing-url-tag | Event missing required 'u' tag | REJECT |
| missing-method-tag | Event missing required 'method' tag | REJECT |
| payload-hash-mismatch | Payload hash doesn't match request body | REJECT |

## Test Key

A test key pair is provided for verification (DO NOT use in production):

- **Private Key:** `e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35`
- **Public Key:** `39a36013301597daef41fbe593a02cc513d0b55527ec2df1050e2e8ff49c85c2`

## Usage

Implementations should:

1. Parse each test vector
2. Verify the signature using BIP-340 Schnorr verification
3. Check that the result matches the `expected` field
4. For REJECT cases, optionally check `expected_status` for HTTP status code

## References

- [NIP-98](https://nips.nostr.com/98) - HTTP Auth
- [NIP-01](https://nips.nostr.com/1) - Basic Protocol (event structure)
- [BIP-340](https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki) - Schnorr Signatures
- [HTTP Schnorr Auth Spec](https://nostrcg.github.io/http-schnorr-auth/)
