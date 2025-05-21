const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const setupSwagger = (app) => {
  // Serve Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  
  // Display API documentation link in the root
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Welcome to Personal Finance Tracker API',
      documentation: 'API documentation available at /api-docs'
    });
  });
};

module.exports = setupSwagger;