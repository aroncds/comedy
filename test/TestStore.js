var Store = artifacts.require("Store");
var Token = artifacts.require("Token");

contract('Store', function(accounts){

    let store;
    let token;
    let buyMin;

    beforeEach(async () => {
        store = await Store.new();
        token = await Token.new(await store.token());
        buyMin = (await store.buyPrice()).toNumber();
    })

    it('should buy 200 tokens', async () => {
        await store.buy({from:accounts[0],value:buyMin * 200});
        var balance = await token.balanceOf(accounts[0]);

        assert.equal(balance.toNumber(), 200, "check if amount is correct");
    })

    it('should transfered tokens', async () => {
        //await store.buy({from:accounts[0],value: buyMin * 200});
        await token.transfer(store.address, 200, {from: accounts[0]});
        var balance = await token.balanceOf(accounts[0]);
        var units = await store.getUnits({form: accounts[0]});

        assert.equal(balance.toNumber(), 0, "check if have been removed the tokens");
        assert.equal(units.toNumber(), 200, "check if have been credited the tokens");
    });

    it('should withdraw token', async () => {
        //await store.buy({from:accounts[0],value:buyMin * 200});
        //await token.transfer(store.address, 200, {from: accounts[0]});
        await store.withdrawToken(200, {from: accounts[0]});
        var units = await store.getUnits();

        assert.equal(units, 0, "check if received token");
    });
});