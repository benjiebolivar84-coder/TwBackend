const ethService = require('./chains/eth.service');
const bscService = require('./chains/bsc.service');
const btcService = require('./chains/btc.service');

const services = { eth: ethService, bsc: bscService, btc: btcService };

exports.getBalance = async (coin, address) => {
  const service = services[coin];
  if (!service) throw new Error(`Unsupported coin: ${coin}`);
  return service.getBalance(coin, address);
};

exports.broadcastTx = async (coin, rawTx) => {
  const service = services[coin];
  if (!service) throw new Error(`Unsupported coin: ${coin}`);
  return service.broadcastTx(coin, rawTx);
};
