var Wallet = artifacts.require("Wallet");
var Store = artifacts.require("Store");
var Token = artifacts.require("Token");
var Joke = artifacts.require("Joke");
var Registry = artifacts.require("Registry");


module.exports = async (deployer) => {
  var registry, token, wallet, store, joke;

  await deployer.deploy(Registry);
  registry = await Registry.deployed();

  await deployer.deploy(Token);
  token = await Token.deployed();
  await registry.register("token", token.address);

  await deployer.deploy(Wallet, registry.address);
  wallet = await Wallet.deployed();
  await registry.register("wallet", wallet.address);

  await deployer.deploy(Store, registry.address);
  store = await Store.deployed();
  await registry.register("store", store.address);

  await deployer.deploy(Joke, registry.address);
  joke = await Joke.deployed();

  await token.transfer(wallet.address, await token.INITIAL_SUPPLY());
  await wallet.approve(store.address);
  await wallet.approve(joke.address);
};