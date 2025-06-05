const { Sequelize } = require('sequelize');
const config = require('./config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(process.env.SUPABASE_DATABASE_URL, {
  dialect: dbConfig.dialect,
  protocol: dbConfig.protocol,
  dialectOptions: dbConfig.dialectOptions,
  logging: dbConfig.logging
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize; 