const { ethers } = require('ethers');
const { getSwapQuote } = require('../service/zeroX.service');
const { getQuickNodeProvider } = require('../../quicknode/provider/quicknode.provider');
const { success, failure } = require('../../../../utils/response');

exports.swapUSDTtoBNB = async (req, res) => {
  const { privateKey, amountUSDT } = req.body;
  if (!privateKey || !amountUSDT) return failure(res, 'Missing fields');

  try {
    const provider = getQuickNodeProvider();
    const wallet = new ethers.Wallet(privateKey, provider);

    // USDT (BEP20) & WBNB contract addresses
    const USDT = '0x55d398326f99059fF775485246999027B3197955';
    const WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

    // Convert to wei
    const amountWei = ethers.utils.parseUnits(amountUSDT.toString(), 18);

    //  Get swap data from 0x
    const quote = await getSwapQuote(USDT, WBNB, amountWei.toString(), wallet.address);

    //  Build & send transaction
    const tx = await wallet.sendTransaction({
      to: quote.to,
      data: quote.data,
      value: quote.value ? ethers.BigNumber.from(quote.value) : 0,
      gasLimit: quote.gas || 300000
    });

    return success(res, { txHash: tx.hash, price: quote.price });
  } catch (err) {
    console.error('Swap failed:', err.message);
    return failure(res, 'Swap failed', { error: err.message });
  }
};
