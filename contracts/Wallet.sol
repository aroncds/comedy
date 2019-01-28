pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./interfaces/IRegistry.sol";


contract Wallet is Ownable {

    address private registry;
    mapping(address=>bool) private approveds;

    event OnSendEther(address indexed to, uint256 units);
    event OnSendToken(address indexed from, address indexed to, uint256 units);

    modifier onlyApproved {
        require(approveds[msg.sender], "only-approved");
        _;
    }

    constructor(address _registry) public payable {
        registry = _registry;
    }

    function approve(address owner)
        public
        onlyOwner
    {
        approveds[owner] = true;
        IERC20(IRegistry(registry).getContract("token")).approve(owner, 2 ** 256 - 1);
    }

    function removeApprove(address owner)
        public
        onlyOwner
    {
        delete approveds[msg.sender];
        IERC20(IRegistry(registry).getContract("token")).approve(owner, 0);
    }

    function sendEther(address payable to, uint256 ethers)
        external
        onlyApproved
        returns(bool)
    {
        require(address(this).balance>=ethers, "balance-insufficient");
        to.transfer(ethers);

        emit OnSendEther(to, ethers);
        return true;
    }

    function captureTokens(address from, uint256 units)
        external
        onlyApproved
        returns(bool)
    {
        IERC20 erc20 = IERC20(IRegistry(registry).getContract("token"));
        require(erc20.transferFrom(from, address(this), units), "no-transfered");
        return true;
    }

    function sendToken(address from, address to, uint256 units)
        external
        onlyApproved
        returns(bool)
    {
        require(IERC20(IRegistry(registry).getContract("token"))
            .transferFrom(from, to, units), "no-transfered");
        emit OnSendToken(from, to, units);
        return true;
    }

    function kill(address payable to)
        public
        onlyOwner
    {
        IERC20 erc20 = IERC20(IRegistry(registry).getContract("token"));
        erc20.transfer(to, erc20.balanceOf(address(this)));
        selfdestruct(to);
    }

    function() external payable {}
}