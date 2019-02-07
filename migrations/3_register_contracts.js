var Wallet = artifacts.require("Wallet");
var Store = artifacts.require("Store");
var Token = artifacts.require("Token");
var Joke = artifacts.require("Joke");
var Registry = artifacts.require("Registry");


module.exports = async (deployer) => {
  let registry, token, wallet, store, joke, supply;

  registry = await Registry.deployed();
  token = await Token.deployed();
  wallet = await Wallet.deployed();
  store = await Store.deployed();
  joke = await Joke.deployed();
  supply = await token.INITIAL_SUPPLY();

  // register contracts
  await Promise.all([
    registry.register("token", token.address),
    registry.register("wallet", wallet.address),
    registry.register("store", store.address)
  ]);

  await Promise.all([
    // wallet assets
    token.transfer(wallet.address, supply),
    // wallet approve
    wallet.approve(store.address),
    wallet.approve(joke.address)
  ])
};