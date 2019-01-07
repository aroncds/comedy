var Joke = artifacts.require("Joke");

contract('Joke', function(accounts){
    let instance;

    beforeEach(async () => {
        instance = await Joke.new();
    });

    it('should write a new joke', async () => {
        var message = "Fuck you";
        var result = await instance.create(message, {from: accounts[0]});
        var data = await instance.joke(1, {form: accounts[0]});

        assert.equal(data[0].toNumber(), 1, "check if version code is 1");
        assert.equal(data[3].toNumber(), 0, "check if likes is initialize with 0");
        assert.equal(data[5].toString(), message, "check if message storaged is the same");
    });
});