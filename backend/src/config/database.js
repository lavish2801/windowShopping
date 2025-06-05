require('dotenv').config();

module.exports = {
  development: {
    url: process.env.SUPABASE_DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  },
  production: {
    url: process.env.SUPABASE_DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
}; 