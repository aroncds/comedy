var Wallet = artifacts.require("Wallet");
var Token = artifacts.require("Token");
var Registry = artifacts.require("Registry");


contract("Wallet", function(accounts){

    let wallet;
    let token;
    let registry;

    beforeEach(async () => {
        var value = web3.utils.toWei("1", "ether");

        registry = await Registry.new();

        token = await Token.new();
        await registry.register("token", token.address);
        
        wallet = await Wallet.new(registry.address, {value: value});
        await registry.register("wallet", wallet.address);

        var amount = await token.balanceOf(accounts[0]);
        await token.transfer(wallet.address, (amount-200).toString());
    });

    it("should send ethers to other account", async () => {
        var amount = web3.utils.toWei("0.5", "ether");
        var accountBalance = await web3.eth.getBalance(accounts[1]);
        var expectBalance = (parseInt(accountBalance) + parseInt(amount)).toString();

        await wallet.approve(accounts[0]);
        await wallet.sendEther(accounts[1], amount);

        var currentBalance = await web3.eth.getBalance(accounts[1]);

        assert.equal(expectBalance, currentBalance, "check if balance expected is right");
    });

    it("should send token to other account", async () => {
        var amount = 200;
        var accountBalance = await token.balanceOf(accounts[1]);
        var expectBalance = accountBalance.toNumber() + amount;

        await token.approve(wallet.address, amount);
        await wallet.approve(accounts[0]);
        await wallet.sendToken(accounts[0], accounts[1], amount);

        var currentBalance = await token.balanceOf(accounts[1]);

        assert.equal(expectBalance, currentBalance.toNumber(), "check if balance expected is right");
    });

    it('should destruct the contract and send all assets to other accounts', async() => {
        var newWallet = await Wallet.new(registry.address);

        var tokenOldBalance = await token.balanceOf(wallet.address);
        var balanceOldWallet = await web3.eth.getBalance(wallet.address);
    
        await wallet.kill(newWallet.address);
    
        var tokenBalance = await token.balanceOf(newWallet.address);
        var balanceMewWallet = await web3.eth.getBalance(newWallet.address);

        assert.equal(balanceMewWallet.toString(), balanceOldWallet.toString(), "check if eth balance is the same");
        assert.equal(tokenBalance.toString(), tokenOldBalance.toString(), "check if token balance is the same");
    });

});