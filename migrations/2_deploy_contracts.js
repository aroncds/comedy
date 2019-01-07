var Store = artifacts.require("Store");
var Token = artifacts.require("Token");
var Joke = artifacts.require("Joke");

module.exports = function(deployer) {
  deployer.deploy(Store);
  deployer.deploy(Joke);
};
