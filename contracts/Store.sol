pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./library/AddressUtils.sol";
import "./interfaces/IRegistry.sol";
import "./interfaces/IWallet.sol";


contract Store is Ownable {
    using SafeMath for uint256;
    using AddressUtils for address;

    address private registry;

    uint128 public buyMin = 100;
    uint128 public sellMin = 150;

    uint256 public buyPrice = 0.0001 ether;
    uint256 public sellPrice = 0.00008 ether;

    bool public paused = false;

    mapping(address=>uint256) public etherToPay;

    event OnBuy(address indexed owner, uint256 value);
    event OnSell(address indexed owner, uint256 value);
    event OnWithdraw(address indexed target, uint256 sended);
    event OnBuyChange(uint256 min, uint256 value);
    event OnSellChange(uint256 min, uint256 value);

    modifier whenNotPaused {
        require(!paused, "paused");
        _;
    }

    modifier whenPaused {
        require(paused, "not-paused");
        _;
    }

    constructor(address _registry)
        public
        Ownable()
    {
        registry = _registry;
    }


    function setBuy(uint256 min, uint256 value)
        public
        onlyOwner
        whenPaused
    {
        buyMin = uint128(min);
        buyPrice = value;
        emit OnBuyChange(min, value);
    }

    function setSell(uint256 min, uint256 value)
        public
        onlyOwner
        whenPaused
    {
        sellMin = uint128(min);
        sellPrice = value;
        emit OnSellChange(min, value);
    }

    function setPause(bool value)
        public
        onlyOwner
    {
        paused = value;
    }

    function buy()
        public
        payable
        whenNotPaused
        returns(bool)
    {
        uint256 units = uint(msg.value).div(buyPrice);
        address _registry = registry;
        address payable wallet = IRegistry(_registry).getContract("wallet").toPayable();
        IERC20 token = IERC20(IRegistry(_registry).getContract("token"));

        require(units >= buyMin, "min-units");
        require(token.balanceOf(wallet) >= units, "token-min-units");
        require(token.transferFrom(wallet, msg.sender, units), "no-transfered");
        
        wallet.transfer(msg.value);
        
        emit OnBuy(msg.sender, units);
        return true;
    }

    function sell(uint256 units)
        public
        whenNotPaused
        returns(bool)
    {
        address wallet = IRegistry(registry).getContract("wallet");
        require(IWallet(wallet)
            .captureTokens(msg.sender, units), "capture-failed");

        etherToPay[msg.sender] += sellPrice.mul(units);

        emit OnSell(msg.sender, etherToPay[msg.sender]);
        return true;
    }

    function withdraw()
        public
        whenNotPaused
        returns(bool)
    {
        address wallet = IRegistry(registry).getContract("wallet");
        uint256 ethers = etherToPay[msg.sender];
        etherToPay[msg.sender] = 0;

        require(wallet.balance >= ethers, "balance-down");
        require(IWallet(wallet).sendEther(msg.sender, ethers), "send-failed");

        emit OnWithdraw(msg.sender, ethers);
        
        return true;
    }

    function () external {
        revert();
    }
}