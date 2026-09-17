# Setting up Redis for BIS-SATHI

This document outlines the Redis infrastructure required for the BIS-SATHI Primary Server Prototype MVP.

## 1. Purpose of Redis in BIS-SATHI

Redis serves as a high-performance, short-lived storage layer for infrastructure operations that should not pollute the primary MongoDB database. 

It is used for:
- **Token Revocation (Blacklisting)**: Storing invalidated JWTs (via their `jti`) until they naturally expire.
- **Google OAuth Handoff**: Storing the one-time temporary validation code securely to pass authentication context from the server to the frontend.
- **AI Response Caching**: Storing deterministic AI responses briefly to save upstream costs and improve responsiveness.
- **Rate Limiting**: Distributed rate-limiting across instances for security endpoints.

## 2. Setup and Configuration

### Local Environment
For local development, you need a running Redis instance.
Using Docker is the easiest method:
```bash
docker run -d --name bis-redis -p 6379:6379 redis:alpine
```

### Environment Variables
Configure the connection in your `primary-server/.env` file:
```env
REDIS_URL=redis://127.0.0.1:6379
```
*Note: If your Redis instance requires a password, use the format `redis://:password@host:port`.*

## 3. Key Namespaces and Strategies

To avoid collisions, we use strict namespaces for Redis keys:

- **Auth Blacklist**: 
  - Access Tokens: `auth:blacklist:access:<jti>`
  - Refresh Tokens: `auth:blacklist:refresh:<jti>`
  - *TTL Strategy*: Keys are assigned a TTL exactly matching the remaining seconds until the JWT naturally expires. They clean themselves up automatically.

- **Google OAuth Handoff**: 
  - Key: `oauth:google:handoff:<code>`
  - *TTL Strategy*: Fixed to 60 seconds. The code is strictly one-time-use and is atomically retrieved and deleted.

- **AI Cache**:
  - Key: `cache:ai:<sha256_hash>`
  - *TTL Strategy*: Fixed to 300 seconds (5 minutes). Hashing the deterministic parts of the request (userId, sessionId, message) prevents PII leakage.

- **Rate Limiting**:
  - Prefix: `rl:auth:` and `rl:chat:` and `rl:general:`

## 4. Security Considerations

- **Never** expose the `REDIS_URL` to the frontend.
- **Never** store raw OAuth provider credentials (like Google Client Secrets) or JWT signing secrets in Redis.
- **Never** store complete JWTs as the value in the blacklist. We only store the `jti` and set the value to `"revoked"`.
- If Redis becomes temporarily unavailable, the application will degrade gracefully (e.g., rate limits will fail open, and AI caches will bypass). Ensure Redis is highly available in production.
