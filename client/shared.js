/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
export const constants = {
    // List of user roles
    userRoles: ['guest', 'user', 'admin'],

    sentry: {
        publicDsn: process.env.SENTRY_PUBLIC_DSN || ''
    }
};
