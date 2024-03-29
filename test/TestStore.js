var Store = artifacts.require("Store");
var Token = artifacts.require("Token");
var Wallet = artifacts.require("Wallet");
var Registry = artifacts.require("Registry");

contract('Store', function(accounts){

    let store;
    let token;
    let wallet;
    let registry;
    let buyPrice;
    let sellPrice;

    beforeEach(async () => {
        registry = await Registry.new();

        token = await Token.new();
        await registry.register("token", token.address);

        wallet = await Wallet.new(registry.address);
        await registry.register("wallet", wallet.address);

        store = await Store.new(registry.address);
        await registry.register("store", store.address);

        buyPrice = (await store.buyPrice()).toNumber();
        sellPrice = (await store.sellPrice()).toNumber();

        await wallet.approve(store.address);
        await token.transfer(wallet.address, await token.INITIAL_SUPPLY());
    });

    it('should change the price to buy and sell', async () => {
        await store.setPause(true);

        var nbPrice = web3.utils.toWei("0.005", "ether");
        var nsPrice = web3.utils.toWei("0.004", "ether");

        await store.setBuy(await store.buyMin(), nbPrice);
        var bPrice = await store.buyPrice();

        assert.equal(bPrice.toString(), nbPrice, "check if buy price is correct.");

        await store.setSell(await store.sellMin(), nsPrice);
        var sPrice = await store.sellPrice();

        assert.equal(sPrice.toString(), nsPrice, "check if sell price is correct.");
    });

    it('should buy 200 tokens', async () => {
        await store.buy({from: accounts[0], value: buyPrice * 200});
        var balance = await token.balanceOf(accounts[0]);

        assert.equal(balance.toNumber(), 200, "check if amount is correct");
    })

    it('should seller 200 tokens', async () => {
        await store.buy({from: accounts[0], value: buyPrice * 200});
        await token.approve(wallet.address, 200, {from: accounts[0]});
        await store.sell(200, {from: accounts[0]});

        var balance = await token.balanceOf(accounts[0]);
        var units = await store.etherToPay(accounts[0]);

        assert.equal(balance.toString(), "0", "check if have been removed the tokens");
        assert.equal(units.toString(), (200 * sellPrice).toString(), "check if have been credited the tokens");
    });

    it('should withdraw ethers in balance', async () => {
        await store.buy({from: accounts[0], value: buyPrice * 200});
        await token.approve(wallet.address, 200, {from: accounts[0]});
        await store.sell(200, {from: accounts[0]});
        
        var units = await store.etherToPay(accounts[0]);
        assert.equal(units.toString(), (200 * sellPrice).toString(), "check if have been credited the tokens");

        await store.withdraw({from: accounts[0]});

        var ethers = await store.etherToPay(accounts[0]);

        assert.equal(ethers.toString(), "0", "check if there is ethers in balance");
    });

    it('should refused the transaction when paused', async () => {
        await store.setPause(true);

        try{
            var result = await store.buy({from: accounts[0], value: 123});
        }catch(e){
            assert.equal(e.reason, 'paused', 'check if got a error paused');
        }
    });

    /*it('should destruct a contract and transfer tokens and ethers', async () => {
        var balance = await web3.eth.getBalance(store.address);
        var tokens = await token.balanceOf(store.address);
    
        await store.kill(accounts[1]);
        var units = await token.balanceOf(accounts[1]);
    
        assert.equal(units.toString(), tokens.toString(), "check if token transfer is equal");
    });*/
});
