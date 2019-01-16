pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./interfaces/IWallet.sol";

contract Store is Ownable {
    using SafeMath for uint256;

    IERC20 public token;
    address payable public wallet;

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

    constructor(address _token, address payable _wallet) public Ownable() {
        iSetToken(_token);
        iSetWallet(_wallet);
    }

    function iSetWallet(address payable _wallet) internal { wallet = _wallet; }
    function setWallet(address payable _wallet)
        public
        onlyOwner
        whenPaused
    {
        iSetWallet(_wallet);
    }

    function iSetToken(address _token) internal { token = IERC20(_token); }
    function setToken(address _token)
        public
        onlyOwner
        whenPaused
    {
        iSetToken(_token);
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

    function buy()
        public
        payable
        whenNotPaused
        returns(bool)
    {
        uint256 units = uint(msg.value).div(buyPrice);
        require(units >= buyMin, "min-units");
        require(token.balanceOf(wallet) >= units, "token-min-units");
        require(token.transferFrom(wallet, msg.sender, units), "no-transfered");
        wallet.transfer(msg.value);
        emit Buy(msg.sender, units);
        return true;
    }

    function sell(uint256 units)
        public
        whenNotPaused
        returns(bool)
    {
        require(IWallet(wallet).captureTokens(msg.sender, units), "transfer-failed");

        etherToPay[msg.sender] = sellPrice.mul(units);
        //comission += comissionValue.mul(units);

        emit Sell(msg.sender, etherToPay[msg.sender]);
        return true;
    }

    function withdraw()
        public
        whenNotPaused
        returns(bool)
    {
        uint256 ethers = etherToPay[msg.sender];
        require(wallet.balance >= ethers, "balance-down");
        etherToPay[msg.sender] = 0;
        IWallet(wallet).sendEther(msg.sender, ethers);

        emit Withdraw(msg.sender, ethers);
        
        return true;
    }

    function kill(address payable update)
        public
        onlyOwner
    {
        selfdestruct(update);
    }

    function () external {
        revert();
    }
}