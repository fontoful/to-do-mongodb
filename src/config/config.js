/**
 * Export configuration variables for app
 */
module.exports = function () {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        DB_HOST: process.env.DEV_DB_HOST,
        DB_PORT: process.env.DEV_DB_PORT,
        DB_NAME: process.env.DB_NAME,
        SECRET: process.env.SECRET
      };

    case 'production':
      return {
        DB_USER: process.env.PROD_DB_USER,
        DB_PASS: process.env.PROD_DB_PASS,
        DB_NAME: process.env.DB_NAME,
        SECRET: process.env.SECRET,
      };
  }
};