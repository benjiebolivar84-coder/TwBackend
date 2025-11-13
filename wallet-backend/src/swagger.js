const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const getServerUrls = () => {
  const servers = [];
  
  if (process.env.REPLIT_DOMAINS) {
    const replitDomain = process.env.REPLIT_DOMAINS.split(',')[0];
    servers.push({
      url: `https://${replitDomain}:8000`,
      description: 'Replit Production Server'
    });
  }
  
  servers.push({
    url: 'http://localhost:8000',
    description: 'Local Development Server'
  });
  
  return servers;
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TwwWin Wallet API',
      version: '1.0.0',
      description: 'Backend API for multi-chain wallet',
    },
    servers: [
      {
        url: 'http://localhost:8083',
      },
    ],
  },
  apis: [
    './src/routes/*.js',
    './src/integration/api/quicknode/routes/*.js',
    './src/integration/api/0x/routes/*.js',
    'src/wallet/routes/**/*.js',
  ],


};

const swaggerSpec = swaggerJsdoc(options);

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { 
      background-color: #1a1a1a; 
      height: 60px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      position: relative;
    }
    .swagger-ui .topbar a { display: none !important; }

    .swagger-ui .topbar:before {
      content: 'TwwWin Wallet API';
      color: white;
      font-size: 22px;
      font-weight: bold;
      position: absolute;
      left: 20px;
    }
  `,
  customSiteTitle: 'TwwWin Wallet API Docs',
};

module.exports = { swaggerUi, swaggerSpec, swaggerOptions };
