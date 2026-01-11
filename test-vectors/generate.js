#!/usr/bin/env node
/**
 * Generate test vectors for HTTP Schnorr Auth (NIP-98)
 *
 * Usage: node generate.js > vectors.json
 *
 * Dependencies: npm install @noble/secp256k1 @noble/hashes
 */

import * as secp256k1 from '@noble/secp256k1';
import { sha256 } from '@noble/hashes/sha2.js';
import { hmac } from '@noble/hashes/hmac.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

// Configure secp256k1 to use sha256 (required for sync methods)
secp256k1.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp256k1.hashes.sha256 = sha256;

// Test private key (NEVER use in production)
const TEST_PRIVATE_KEY_HEX = 'e8f32e723decf4051aefac8e2c93c9c5b214313817cdb01a1494b917c8436b35';
const TEST_PRIVATE_KEY = hexToBytes(TEST_PRIVATE_KEY_HEX);

// Get public key from private key (x-only, 32 bytes)
const publicKey = bytesToHex(secp256k1.getPublicKey(TEST_PRIVATE_KEY, true).slice(1));

/**
 * Create event ID per NIP-01
 */
function createEventId(event) {
  const serialized = JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content
  ]);
  return bytesToHex(sha256(new TextEncoder().encode(serialized)));
}

/**
 * Sign event per NIP-01 (Schnorr signature over event ID)
 */
async function signEvent(event, privateKey) {
  const id = createEventId(event);
  const sig = await secp256k1.schnorr.sign(hexToBytes(id), privateKey);
  return {
    ...event,
    id,
    sig: bytesToHex(sig)
  };
}

/**
 * Generate all test vectors
 */
async function generateVectors() {
  const now = Math.floor(Date.now() / 1000);
  const vectors = [];

  // 1. Valid GET request
  const validGet = await signEvent({
    pubkey: publicKey,
    created_at: now,
    kind: 27235,
    tags: [
      ['u', 'https://example.com/resource'],
      ['method', 'GET']
    ],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'valid-get-request',
    description: 'Valid GET request authentication event',
    expected: 'ACCEPT',
    event: validGet,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 2. Valid POST with payload
  const payloadBody = 'abc';
  const payloadHash = bytesToHex(sha256(new TextEncoder().encode(payloadBody)));

  const validPost = await signEvent({
    pubkey: publicKey,
    created_at: now,
    kind: 27235,
    tags: [
      ['u', 'https://example.com/api/data'],
      ['method', 'POST'],
      ['payload', payloadHash]
    ],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'valid-post-with-payload',
    description: 'Valid POST request with payload hash',
    expected: 'ACCEPT',
    event: validPost,
    request: { url: 'https://example.com/api/data', method: 'POST', body: payloadBody }
  });

  // 3. Invalid signature
  const invalidSig = { ...validGet };
  invalidSig.sig = '0'.repeat(128);

  vectors.push({
    id: 'invalid-signature',
    description: 'Event with corrupted signature',
    expected: 'REJECT',
    expected_status: 401,
    event: invalidSig,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 4. Wrong kind
  const wrongKind = await signEvent({
    pubkey: publicKey,
    created_at: now,
    kind: 1,
    tags: [
      ['u', 'https://example.com/resource'],
      ['method', 'GET']
    ],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'wrong-kind',
    description: 'Event with wrong kind (not 27235)',
    expected: 'REJECT',
    expected_status: 401,
    event: wrongKind,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 5. Expired event
  const expiredEvent = await signEvent({
    pubkey: publicKey,
    created_at: now - 3600,
    kind: 27235,
    tags: [
      ['u', 'https://example.com/resource'],
      ['method', 'GET']
    ],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'expired-event',
    description: 'Event older than 60 seconds',
    expected: 'REJECT',
    expected_status: 401,
    event: expiredEvent,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 6. URL mismatch
  const urlMismatch = await signEvent({
    pubkey: publicKey,
    created_at: now,
    kind: 27235,
    tags: [
      ['u', 'https://other-domain.com/resource'],
      ['method', 'GET']
    ],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'url-mismatch',
    description: "URL in event doesn't match request URL",
    expected: 'REJECT',
    expected_status: 401,
    event: urlMismatch,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 7. Method mismatch
  const methodMismatch = await signEvent({
    pubkey: publicKey,
    created_at: now,
    kind: 27235,
    tags: [
      ['u', 'https://example.com/resource'],
      ['method', 'POST']
    ],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'method-mismatch',
    description: "Method in event doesn't match request method",
    expected: 'REJECT',
    expected_status: 401,
    event: methodMismatch,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 8. Missing URL tag
  const missingUrl = await signEvent({
    pubkey: publicKey,
    created_at: now,
    kind: 27235,
    tags: [['method', 'GET']],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'missing-url-tag',
    description: "Event missing required 'u' tag",
    expected: 'REJECT',
    expected_status: 401,
    event: missingUrl,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 9. Missing method tag
  const missingMethod = await signEvent({
    pubkey: publicKey,
    created_at: now,
    kind: 27235,
    tags: [['u', 'https://example.com/resource']],
    content: ''
  }, TEST_PRIVATE_KEY);

  vectors.push({
    id: 'missing-method-tag',
    description: "Event missing required 'method' tag",
    expected: 'REJECT',
    expected_status: 401,
    event: missingMethod,
    request: { url: 'https://example.com/resource', method: 'GET' }
  });

  // 10. Payload hash mismatch
  vectors.push({
    id: 'payload-hash-mismatch',
    description: "Payload hash doesn't match request body",
    expected: 'REJECT',
    expected_status: 401,
    event: validPost,
    request: { url: 'https://example.com/api/data', method: 'POST', body: 'different content' }
  });

  const output = {
    title: 'HTTP Schnorr Auth Test Vectors',
    description: 'Test vectors for NIP-98/HTTP Schnorr Auth implementations',
    version: '0.0.1',
    generated_at: new Date().toISOString(),
    test_keys: {
      private_key_hex: TEST_PRIVATE_KEY_HEX,
      public_key_hex: publicKey,
      warning: 'TEST KEY ONLY - never use in production'
    },
    vectors,
    references: {
      nip98: 'https://nips.nostr.com/98',
      nip01: 'https://nips.nostr.com/1',
      bip340: 'https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki'
    }
  };

  console.log(JSON.stringify(output, null, 2));
}

generateVectors().catch(console.error);
