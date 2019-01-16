pragma solidity ^0.5.0;

interface IWallet {
    function sendEther(address payable to, uint256 units) external;
    function captureTokens(address from, uint256 units) external returns(bool);
}