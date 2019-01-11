pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./interfaces/IStore.sol";


contract Token is ERC20{

    string public name = "Laugh";
    string public symbol = "LGH";
    uint256 public decimals = 0;
    uint256 public INITIAL_SUPPLY = 21000000000000;

    constructor()
        public
    {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function() external {
        revert();
    }
}