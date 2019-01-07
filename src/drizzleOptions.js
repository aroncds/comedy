import Joke from './../build/contracts/Joke.json';
import Store from './../build/contracts/Store.json';

const drizzleOptions = {
  web3: {
    block: false,
    fallback: {
      type: 'ws',
      url: 'ws://127.0.0.1:8545'
    }
  },
  contracts: [
    Joke,
    Store
  ],
  events: {
    Joke: ['Create'],
    Store: [
      'Buy',
      'Sell',
      'Transfered',
      'Withdraw',
      'ChangeBuyPrice',
      'ChangeSellPrice']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions