pragma solidity ^0.5.0;

interface IStore {
    function buy() external payable returns(bool);
    function sell(uint256 units) external returns(bool);
    function withdraw() external returns(bool);
}