import Joke from './../build/contracts/Joke.json';
import Store from './../build/contracts/Store.json';
import Token from './../build/contracts/Token.json';

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
    Store,
    Token
  ],
  events: {
    Joke: ['Create'],
    Store: [
      'Buy',
      'Sell',
      'Withdraw',
      'BuyPrice',
      'SellPrice']
  },
  polls: {
    accounts: 1500
  }
}

export default drizzleOptions