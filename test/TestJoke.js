var Joke = artifacts.require("Joke");

contract('Joke', function(accounts){
    let instance;

    beforeEach(async () => {
        instance = await Joke.new();
    });

    it('should write a new joke', async () => {
        var message = "Fuck you";
        
        await instance.create(message, {from: accounts[0]});
        var data = await instance.joke(0, {form: accounts[0]});

        assert.equal(data[0].toNumber(), 1, "check if version code is 1");
        assert.equal(data[3].toNumber(), 0, "check if likes is initialize with 0");
        assert.equal(data[5].toString(), message, "check if message storaged is the same");
    });

    it('should upgrade the contract', async () => {
        var instance2 = await Joke.new();

        await instance.setUpgrade(instance2.address, {from: accounts[0]});

        var contractAddress = await web3.eth.getStorageAt(instance.address, 4);
        console.log(contractAddress)

        await instance.create("Aron", {from: accounts[0]});

        var data = await instance.joke(0, {from: accounts[0]});

        assert.equal(data[5], "Aron", "check if data have been storaged");
    });

    it('should pause the contract', async () => {
        await instance.setPause(true, {from: accounts[0]});

        try{
            await instance.create("aron", {from: accounts[0]});
            assert.equal(1,0, "no paused");
        }catch(e){}
    });
});