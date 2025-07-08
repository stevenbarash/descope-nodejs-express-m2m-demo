// Authentication and authorization middleware for Express API server.
// Provides JWT verification, permission, and role checks for endpoints.
const { validateDescopeJwt } = require('../descope');

/**
 * Middleware to verify Descope JWT from Authorization header.
 * Attaches JWT payload to req.auth if valid.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {Function} next
 */
const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    // Check for Bearer token in Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    // Validate JWT using Descope SDK
    const jwtResponse = await validateDescopeJwt(token);
    req.auth = jwtResponse; // Attach decoded JWT to request
    next();
  } catch (err) {
    // Invalid or expired token
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Debug middleware to log auth info for debugging purposes.
 */
const debug = (req, res, next) => {
  console.log('auth:', req.auth);
  next();
};

/**
 * Middleware factory to check JWT scopes/permissions.
 * @param {string[]} expectedScopes - Required scopes/permissions for the endpoint
 * @param {Object} [options]
 * @param {boolean} [options.checkAllScopes=true] - If true, require all scopes; else, any
 */
const checkJWTScopes = (expectedScopes, { checkAllScopes = true } = {}) => {
  if (!Array.isArray(expectedScopes)) {
    throw new Error('Parameter expectedScopes must be an array of strings representing the scopes for the endpoint(s)');
  }
  return (req, res, next) => {
    // Helper for forbidden error
    const error = () => next({ statusCode: 403, error: 'Forbidden', message: 'Insufficient scope' });
    if (expectedScopes.length === 0) return next();
    // Extract scopes/permissions from JWT payload
    const scopes = req.auth?.scope || req.auth?.permissions || req.auth?.token?.permissions || [];
    // Check if all or any required scopes are present
    const allowed = checkAllScopes
      ? expectedScopes.every(scope => scopes.includes(scope))
      : expectedScopes.some(scope => scopes.includes(scope));
    return allowed ? next() : error();
  };
};

/**
 * Middleware to check all JWT permissions (all required).
 * @param {string[]} expectedScopes
 */
const checkJWTPermissions = expectedScopes => checkJWTScopes(expectedScopes, { checkAllScopes: true });

/**
 * Middleware to check required permissions and roles for a specific tenant.
 * @param {string} tenantId
 * @param {string[]} requiredPermissions
 * @param {string[]} requiredRoles
 */
const requireTenantPermissions = (tenantId, requiredPermissions = [], requiredRoles = []) => (req, res, next) => {
  // Get tenant info from JWT
  const tenant = req.auth?.tenants?.[tenantId];
  if (!tenant) return res.status(403).json({ message: 'No access to tenant' });
  // Check all required permissions and roles for tenant
  const hasPermissions = requiredPermissions.every(p => tenant.permissions.includes(p));
  const hasRoles = requiredRoles.every(r => tenant.roles.includes(r));
  if (!hasPermissions || !hasRoles) return res.status(403).json({ message: 'Forbidden' });
  next();
};

/**
 * Middleware to check required permissions (top-level, not tenant-specific).
 * @param {string[]} requiredPermissions
 */
const requirePermissions = (requiredPermissions = []) => (req, res, next) => {
  const userPermissions = req.auth?.permissions || [];
  // Check all required permissions
  const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
  if (!hasPermission) return res.status(403).json({ message: 'Forbidden' });
  next();
};

/**
 * Middleware to check required roles (top-level, not tenant-specific).
 * @param {string[]} requiredRoles
 */
const requireRoles = (requiredRoles = []) => (req, res, next) => {
  const userRoles = req.auth?.roles || [];
  // Check all required roles
  const hasRole = requiredRoles.every(r => userRoles.includes(r));
  if (!hasRole) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = {
  verifyJWT,
  debug,
  checkJWTScopes,
  checkJWTPermissions,
  requireTenantPermissions,
  requirePermissions,
  requireRoles,
};