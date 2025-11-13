const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // old routes
const { swaggerUi, swaggerSpec, swaggerOptions } = require('./swagger');
const registerQuickNode = require('./integration/api/quicknode');
const registerZeroX = require('./integration/api/0x');

const walletRoutes = require('./wallet/routes/wallet.routes');
const accountRoutes = require('./wallet/routes/walletNetwork.routes');

require('dotenv').config({ path: __dirname + '/../.env' });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/wallet', walletRoutes);
app.use('/wallet-network', accountRoutes);


app.use('/', routes);

registerQuickNode(app);
registerZeroX(app);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

module.exports = app;
