export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || 'vietmy_callcenter',
    user: process.env.DB_USER || 'postgres',
    pass: process.env.DB_PASS || 'postgres123',
    sync: process.env.DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  twoFa: {
    appName: process.env.TWO_FA_APP_NAME || 'VietMyCallCenter',
  },

  upload: {
    dest: process.env.UPLOAD_DEST || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880,
  },
});
