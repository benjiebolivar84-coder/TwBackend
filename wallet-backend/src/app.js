const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const { swaggerUi, swaggerSpec, swaggerOptions } = require('./swagger');
const registerQuickNode = require('./integration/api/quicknode');
const registerZeroX = require('./integration/api/0x');



require('dotenv').config({ path: __dirname + '/../.env' });


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

registerQuickNode(app);
registerZeroX(app);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));


module.exports = app;
