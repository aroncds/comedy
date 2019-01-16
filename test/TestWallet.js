var Wallet = artifacts.require("Wallet");
var Token = artifacts.require("Token");

contract("Wallet", async () => {

    let wallet;
    let token;

    beforeEach(async () => {
        token = await Token.new();
        wallet = await Wallet.new(
            token.address, {value: web3.utils.toWei(1, "ether")});

        await token.transfer(wallet.address, await token.INITIAL_SUPPLY());
    });

    it("should send ethers to other account", async () => {

        //wallet.sendEther()
    });

});