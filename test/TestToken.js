const Token = artifacts.require("Token");

contract('Token', function(accounts){

    let token;
    let amount = 100;

    beforeEach(async () => {
        token = await Token.new();
    });

    it('should transfer token to other accounts', async () => {
        await token.transfer(accounts[1], amount);
        var balance = await token.balanceOf(accounts[1]);
        assert.equal(balance, amount, "check if the balance is right");
    });

    it('should let other account control your token', async () => {
        await token.approve(accounts[1], amount);
        var valueAllowed = await token.allowance(accounts[0], accounts[1]);

        assert.equal(valueAllowed.toNumber(), amount, "check if value allowed is the same");
    });

    it('should transfer token let for other account', async() => {
        await token.approve(accounts[1], amount);
        await token.transferFrom(accounts[0], accounts[2], amount, {from: accounts[1]});

        var balance = await token.balanceOf(accounts[2]);

        assert.equal(balance.toNumber(), amount, "check if the tokens was sended");
    });
});