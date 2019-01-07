pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./interfaces/IStore.sol";


contract Token is ERC20, Ownable{

    string public name = "Laugh";
    string public symbol = "LGH";
    uint256 public decimals = 8;
    uint256 public INITIAL_SUPPLY = 21000000000 * (10 ** decimals);

    IStore private _store;

    constructor(address store) public Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
        _store = IStore(store);
    }

    function changeStore(address store) public onlyOwner {
        _store = IStore(store);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        bool result = super.transfer(to, value);

        if (to == address(_store)){
            _store._transfered(msg.sender, value);
        } 
    
        return result;
    }

    function() external {
        revert();
    }
}