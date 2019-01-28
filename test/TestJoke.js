var Joke = artifacts.require("Joke");
var Wallet = artifacts.require("Wallet");
var Token = artifacts.require("Token");
var Registry = artifacts.require("Registry");


contract('Joke', function(accounts){
    let instance;
    let wallet;
    let registry;
    let token;

    beforeEach(async () => {
        registry = await Registry.new();
    
        wallet = await Wallet.new(registry.address);
        await registry.register("wallet", wallet.address);

        token = await Token.new();
        await registry.register("token", token.address);

        instance = await Joke.new(registry.address);

        var amount = await token.balanceOf(accounts[0]);

        await token.transfer(wallet.address, amount - 500);
        await wallet.approve(instance.address);
    });

    it('should write a new joke', async () => {
        var message = "It's funny";
        
        await instance.create(message);
        var data = await instance.joke(0);

        assert.equal(data[0].toNumber(), 1, "check if version code is 1");
        assert.equal(data[3].toNumber(), 0, "check if likes is initialize with 0");
        assert.equal(data[5].toString(), message, "check if message storaged is the same");
    });

    it('should send one like to joke', async() => {
        await token.approve(wallet.address, 100);

        await instance.create("test", {from: accounts[1]});
        await instance.addLike(0, 100);

        var data = await instance.joke(0);
        var amount = await token.balanceOf(accounts[1]);

        assert.equal(data[3].toNumber(), 1, "check if like was computate");
        assert.equal(amount.toNumber(), 100, "check if token was removed");
    });

    it('should revert when it inst approved', async() => {
        
        try {
            await instance.create("test", {from: accounts[1]});
            await instance.addLike(0, 100);

            var data = await instance.joke(0);

            assert.equal(data[3].toNumber(), 0, "no approved");
        }catch(e){
            assert.notEqual(e.message.indexOf("revert"), -1, "check if the contract was reverted");
        }
    });

    it('should pause the contract', async () => {
        await instance.setPause(true);

        try{
            await instance.create("aron");
            assert.equal(1,0, "no paused");
        }catch(e){}
    });

    /*it('should upgrade the contract', async () => {
        var instance2 = await Joke.new();

        await instance.setUpgrade(instance2.address, {from: accounts[0]});

        var contractAddress = await web3.eth.getStorageAt(instance.address, 4);
        //console.log(contractAddress)

        await instance.create("Aron");

        var data = await instance.joke(0);

        assert.equal(contractAddress, instance2.address, "check if contract has been upgraded");
        assert.equal(data[5], "Aron", "check if data have been storaged");
    });*/
});