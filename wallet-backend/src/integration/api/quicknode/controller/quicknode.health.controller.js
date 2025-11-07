const { success, failure } = require('../../../../utils/response');
const { getQuickNodeProvider } = require('../provider/quicknode.provider');

// ✅ Health check controller
exports.checkHealth = async (req, res) => {
  try {
    const provider = getQuickNodeProvider();
    const network = await provider.getNetwork();
    const latestBlock = await provider.getBlockNumber();

    return success(res, {
      status: 'UP',
      message: 'QuickNode connection healthy',
      network: {
        name: network.name,
        chainId: network.chainId,
        latestBlock
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return failure(res, 'QuickNode health check failed', { message: err.message });
  }
};
