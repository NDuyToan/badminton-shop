module.exports = {
    apps: [
        {
            name: 'badminton-api',
            cwd: './apps/api',
            script: './dist/src/main.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
        },

        {
            name: 'badminton-admin',
            cwd: './apps/admin',
            script: 'npm',
            args: 'start',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3002,
            },
        },
    ],
};