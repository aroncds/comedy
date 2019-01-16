pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract Wallet is Ownable {

    IERC20 public token;
    mapping(address=>bool) private approveds;

    event OnSendEther(address indexed to, uint256 units);

    modifier onlyApproved {
        require(approveds[msg.sender], "only-approved");
        _;
    }

    constructor(address _token) public {
        token = IERC20(_token);
    }

    function setToken(address _token)
        public
        onlyOwner
    {
        token = IERC20(_token);
    }

    function approve(address owner)
        public
        onlyOwner
    {
        approveds[owner] = true;
        token.approve(owner, 2 ** 256 - 1);
    }

    function removeApprove(address owner)
        public
        onlyOwner
    {
        delete approveds[msg.sender];
        token.approve(owner, 0);
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
        uint256 balance = token.allowance(from, address(this));
        require(balance >= units, "units-indisponible");
        require(token.transferFrom(from, address(this), units), "no-transfered");
        return true;
    }

    function() external payable {}
}