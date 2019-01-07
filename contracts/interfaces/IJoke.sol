pragma solidity ^0.5.0;

contract IJoke {
    event Create(address indexed owner, uint256 id);

    function create(string memory body) public;
    function get(uint256 i)
        public
        view
        returns(uint256, uint256, uint256, uint256, address, string memory);
}
