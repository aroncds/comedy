pragma solidity ^0.5.0;

interface IRegistry {
    function getContract(string calldata name) external returns(address);
}