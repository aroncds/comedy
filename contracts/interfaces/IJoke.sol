pragma solidity ^0.5.0;

interface IJoke {
    event Create(address indexed owner, uint256 id);
    event Like(address indexed from, address indexed to, uint256 units);

    function create(string calldata body) external;
    function addLike(uint256 id, uint256 units) external;
    function length() external view returns(uint256);
    function joke(uint256 i) external view returns(
        uint256, uint256, uint256,
        uint256, address, string memory);
    function jokeByAddressLength(address owner) external view returns(uint256);
    function jokeByAddress(address owner, uint256 index) external view returns(
        uint256, uint256, uint256,
        uint256, address, string memory);
}
