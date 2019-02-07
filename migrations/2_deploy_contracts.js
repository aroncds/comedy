var Wallet = artifacts.require("Wallet");
var Store = artifacts.require("Store");
var Token = artifacts.require("Token");
var Joke = artifacts.require("Joke");
var Registry = artifacts.require("Registry");


module.exports = async (deployer) => {
  var registry;

  await deployer.deploy(Registry);
  registry = await Registry.deployed();

  await Promise.all([
    deployer.deploy(Token),
    deployer.deploy(Wallet, registry.address),
    deployer.deploy(Store, registry.address),
    deployer.deploy(Joke, registry.address),
  ]);
};