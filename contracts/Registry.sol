pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract Registry is Ownable {

    mapping(bytes32=>address) private contractRegistred;

    function register(string memory name, address _contract)
        public
        onlyOwner
    {
        contractRegistred[keccak256(bytes(name))] = _contract;
    }

    function getContract(string memory name)
        public
        view
        returns(address)
    {
        return contractRegistred[keccak256(bytes(name))];
    }
}