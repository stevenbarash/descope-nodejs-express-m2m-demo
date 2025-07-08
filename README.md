
# Descope Machine-to-Machine (M2M) Auth Demo

This project demonstrates how to implement secure machine-to-machine (M2M) authentication using [Descope Access Keys](https://docs.descope.com/management/m2m-access-keys). It provides a CLI and API server to show how a service can exchange an Access Key for a JWT and use it to access protected resources.

---

## Overview

Descope Access Keys enable secure, automated authentication between services (M2M), following the client credentials flow. Instead of user credentials, a service presents an Access Key to obtain a JWT, which is then used to authenticate API requests. This approach is ideal for backend services, automation, and microservices.

- [Access Keys Management](https://docs.descope.com/management/m2m-access-keys)
- [Access Keys API Reference](https://docs.descope.com/api/management/access-keys)
- [M2M Security Best Practices](https://docs.descope.com/security-best-practices/m2m-security)

---

## Prerequisites

- Node.js (v16+ recommended)
- A Descope account and project
- Descope Management Key and Project ID

---

## Setup Instructions

### 1. Create an Access Key in Descope Console

1. Log in to the [Descope Console](https://app.descope.com/).
2. Navigate to **Access Keys**.
3. Click **+ Access Key** and fill in:
   - **Name** (required)
   - **Description** (optional)
   - **Expiration** (set expiry for security)
   - **Permitted IPs** (optional, restrict usage)
   - **Authorization** (assign tenants/roles)
4. Save and copy the Access Key **ID** and **Secret** (cleartext). Store securely.

> See: [Descope Access Keys Guide](https://docs.descope.com/management/m2m-access-keys)

### 2. Obtain Management Key and Project ID

- Go to **Management Keys** in the Descope Console.
- Create a new key, set expiration, and copy the key and your Project ID.
- Store these securely. You will not be able to view the key again.

---

## Permissions and Roles Required for Demo

To use all endpoints in this demo, configure the following permissions and roles in your Descope project:

### Permissions
- `read:resource` — Required for GET /resource
- `create:resource` — Required for POST /resource
- `update:resource` — Required for PUT /resource/:id
- `delete:resource` — Required for DELETE /resource/:id
- `SSO Admin` — Required for GET /admin-resource
- `User Admin` — Required for GET /admin-resource

### Roles
- `Admin` — Required for GET /admin-resource
- `AppSecEngineer` — Required for GET /tenant-resource (must be assigned within the specified tenant)

### Tenants
- Example tenant ID: `T2U7vUH1NPy4JzWHruoOVIGyzYlu` (for tenant-resource endpoint)

> Ensure your Access Key is associated with the correct permissions and roles (and tenant, if needed) in the Descope Console. This will allow you to successfully call all protected endpoints in the demo.

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
DESCOPE_PROJECT_ID=<your-descope-project-id>
DESCOPE_MANAGEMENT_KEY=<your-management-key>
DESCOPE_ACCESS_KEY_ID=<your-access-key-id>
DESCOPE_ACCESS_KEY_SECRET=<your-access-key-secret>
PORT=8081
API_BASE_URL=http://localhost:8081
```

---

## Install Dependencies

```bash
npm install
npm install @descope/node-sdk
```

---

## Running the Demo

### 1. Start the API Server

```bash
npm run server
```

This starts the API server that validates JWTs issued by Descope.

### 2. Fetch a JWT and Call the API

In a separate terminal:

```bash
npm run m2m
```

This script exchanges your Access Key for a JWT and uses it to call a protected endpoint.

---

## How It Works

1. **Exchange Access Key for JWT:**
   - The CLI uses the Access Key ID and Secret to request a JWT from Descope.
2. **Call Protected API:**
   - The JWT is sent as a Bearer token to the API server.
   - The server validates the JWT and authorizes access based on roles/tenants.

See the code in `get-m2m-token.js` and `server/` for implementation details.

---

## Security Notes

- **Never commit secrets** (keys, IDs) to version control.
- **Rotate keys** regularly and set short expirations.
- **Restrict IPs** and permissions for each Access Key.
- **Validate JWTs** on every request.

For more, see [M2M Security Best Practices](https://docs.descope.com/security-best-practices/m2m-security).

---

## References

- [Descope Access Keys Management](https://docs.descope.com/management/m2m-access-keys)
- [Descope Access Keys API](https://docs.descope.com/api/management/access-keys)
- [Descope M2M Security Best Practices](https://docs.descope.com/security-best-practices/m2m-security)

