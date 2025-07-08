// API routes for heartbeat, resource, and admin-resource endpoints.
// Includes public and protected endpoints with JWT, permissions, and roles checks.
const express = require('express');
const router = express.Router();
const controller = require('../controllers/hello');
const auth = require('../middleware/auth');

// Heartbeat endpoint (public)
/**
 * GET /api/heartbeat
 * Public endpoint for health check.
 */
router.route('/heartbeat').get(controller.hello);

// Resource endpoints (protected by JWT and permissions)
/**
 * GET, POST /api/resource
 * Requires JWT and appropriate permissions.
 */
router.route('/resource')
  .all(auth.verifyJWT) // Require valid JWT for all methods
  .get(auth.checkJWTPermissions(['read:resource']), controller.hello) // Require read permission
  .post(auth.checkJWTPermissions(['create:resource']), controller.hello); // Require create permission

/**
 * PUT, DELETE /api/resource/:id
 * Requires JWT and appropriate permissions.
 */
router.route('/resource/:id')
  .all(auth.verifyJWT) // Require valid JWT for all methods
  .put(auth.checkJWTPermissions(['update:resource']), controller.hello) // Require update permission
  .delete(auth.checkJWTPermissions(['delete:resource']), controller.hello); // Require delete permission

// Admin resource endpoint (protected by JWT, permissions, and roles)
/**
 * GET /api/admin-resource
 * Requires JWT, SSO Admin/User Admin permissions, and Admin role.
 */
router.route('/admin-resource')
  .all(auth.verifyJWT) // Require valid JWT
  .get(
    auth.requirePermissions(['SSO Admin', 'User Admin']), // Require both permissions
    auth.requireRoles(['Admin']), // Require Admin role
    controller.hello
  );

module.exports = router;
