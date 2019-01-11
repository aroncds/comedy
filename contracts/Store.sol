pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./interfaces/IStore.sol";


contract Store is Ownable, IStore {
    using SafeMath for uint256;

    IERC20 public token;

    uint128 public buyMin = 100;
    uint128 public withdrawMin = 150;

    uint256 public buyPrice = 0.0001 ether;
    uint256 public sellPrice = 0.00008 ether;

    uint256 private comissionValue = 0.00002 ether;
    uint256 private comission = 0;

    bool public paused = false;

    mapping(address=>uint256) public etherToPay;

    event Buy(address indexed owner, uint256 value);
    event Sell(address indexed owner, uint256 value);
    event Withdraw(address indexed target, uint256 sended);
    event BuyPrice(uint256 value);
    event SellPrice(uint256 value);

    modifier whenNotPaused {
        require(!paused, "paused");
        _;
    }

    modifier whenPaused {
        require(paused, "not-paused");
        _;
    }

    modifier isTokenSender {
        require(msg.sender == address(token));
        _;
    }

    constructor(address _token) public Ownable() {
        token = IERC20(_token);
    }

    function buy()
        public
        payable
        whenNotPaused
        returns(bool)
    {
        uint256 units = uint(msg.value).div(buyPrice);
        require(units >= buyMin, "min-units");
        require(token.balanceOf(address(this)) >= units, "token-min-units");
        token.transfer(msg.sender, units);

        emit Buy(msg.sender, units);

        return true;
    }

    function sell(uint256 units)
        public
        whenNotPaused
        returns(bool)
    {
        uint256 balance = token.allowance(msg.sender, address(this));
        require(balance >= units, "units-indisponible");

        require(
            token.transferFrom(msg.sender, address(this), units),
            "transfer-failed");

        etherToPay[msg.sender] = sellPrice.mul(units);
        comission = comissionValue.mul(units);

        emit Sell(msg.sender, etherToPay[msg.sender]);

        return true;
    }

    function withdraw()
        public
        whenNotPaused
        returns(bool)
    {
        uint256 ethers = etherToPay[msg.sender];
        require(address(this).balance >= ethers, "balance-down");
        etherToPay[msg.sender] = 0;
        msg.sender.transfer(ethers);

        emit Withdraw(msg.sender, ethers);
        
        return true;
    }

    function setBuyPrice(uint256 value)
        public
        onlyOwner
        whenPaused
    {
        buyPrice = value;
        emit BuyPrice(value);
    }

    function setSellPrice(uint256 value)
        public
        onlyOwner
        whenPaused
    {
        sellPrice = value;
        emit SellPrice(value);
    }

    function setPause(bool value)
        public
        onlyOwner
    {
        paused = value;
    }

    function kill(address payable update)
        public
        onlyOwner
    {
        token.transfer(update, token.balanceOf(address(this)));
        selfdestruct(update);
    }

    function () external {
        revert();
    }
}