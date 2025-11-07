require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
app.use(bodyParser.json());
app.use(require('cors')());

const PORT = process.env.PORT || 8083;

// Ethereum RPC (Infura / Alchemy)
const ethProvider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

app.get('/', (req, res) => res.send('TwwWin Wallet Backend running!'));

app.get('/wallet/:coin/:address/balance', async (req, res) => {
  const { coin, address } = req.params;
  try {
    if (coin === 'eth') {
      const balance = await ethProvider.getBalance(address);
      return res.json({ coin, balance: ethers.utils.formatEther(balance) });
    }
    res.status(400).json({ error: 'Unsupported coin' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/wallet/:coin/broadcast', async (req, res) => {
  const { coin } = req.params;
  const { rawTx } = req.body;
  try {
    if (coin === 'eth') {
      const tx = await ethProvider.sendTransaction(rawTx);
      return res.json({ txHash: tx.hash });
    }
    res.status(400).json({ error: 'Unsupported coin' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
