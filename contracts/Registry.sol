pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title Registry
 * @dev register contracts to be used for others one
 */


contract Registry is Ownable {

    mapping(bytes32=>address) private contractRegistred;

    function() external {
        revert("no-payable");
    }

    function getContract(string memory name)
        public
        view
        returns(address)
    {
        return contractRegistred[keccak256(bytes(name))];
    }

    function register(string memory name, address _contract)
        public
        onlyOwner
    {
        contractRegistred[keccak256(bytes(name))] = _contract;
    }
}