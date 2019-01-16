var Store = artifacts.require("Store");
var Token = artifacts.require("Token");
var Joke = artifacts.require("Joke");
var Wallet = artifacts.require("Wallet");

module.exports = async (deployer) => {
  var token, wallet;

  await deployer.deploy(Token);
  token = await Token.deployed();
  await deployer.deploy(Wallet, token.address);
  wallet = await Wallet.deployed();

  await deployer.deploy(Store, token.address, wallet.address);
  await deployer.deploy(Joke);
};
