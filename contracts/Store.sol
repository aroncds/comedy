pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./interfaces/IStore.sol";
import "./Token.sol";


contract Store is Ownable, IStore {
    using SafeMath for uint256;

    Token public token;

    uint128 public buyMin = 100;
    uint128 public withdrawMin = 150;

    uint256 public buyPrice = 0.0001 ether;
    uint256 public sellPrice = 0.00008 ether;

    bool public paused = false;

    mapping(address=>uint256) private unitsToPay;
    mapping(address=>bool) private lock;

    event Buy(address indexed owner, uint256 value);
    event Sell(address indexed owner, uint256 value);
    event Transfered(address indexed owner, uint256 value);
    event Withdraw(address indexed target, uint256 sended);
    event ChangeBuyPrice(uint256 value);
    event ChangeSellPrice(uint256 value);

    modifier whenNotPaused {
        require(!paused, "paused");
        _;
    }

    modifier isTokenSender {
        require(msg.sender == address(token));
        _;
    }

    constructor() public Ownable() {
        token = new Token(address(this));
    }

    function buy()
        public
        payable
        whenNotPaused
    {
        uint256 units = uint(msg.value).div(buyPrice);
        require(units >= buyMin, "min-units");
        require(token.balanceOf(address(this)) >= units, "token-min-units");
        token.transfer(msg.sender, units);

        emit Buy(msg.sender, units);
    }

    function _transfered(address target, uint256 value)
        external
        isTokenSender
    {
        uint256 _units = unitsToPay[target];
        unitsToPay[target] = _units.add(value);
        emit Transfered(target, value);
    }

    function withdrawEther()
        public
        whenNotPaused
        returns(uint256)
    {
        uint256 _unitsToPay = unitsToPay[msg.sender];
        require(_unitsToPay >= withdrawMin, "withdraw-min");

        uint256 balance = address(this).balance;
        require(balance > 0, "balance-insuficient");
    
        uint256 etherToPay = _unitsToPay.mul(sellPrice);
        
        if (balance >= etherToPay){
            unitsToPay[msg.sender] = 0;
        }else{
            etherToPay = etherToPay.sub(balance);
            unitsToPay[msg.sender] = _unitsToPay.sub(etherToPay.div(sellPrice));
        }
    
        msg.sender.transfer(etherToPay);

        emit Withdraw(msg.sender, etherToPay);

        return etherToPay;
    }

    function withdrawToken(uint units) public {
        uint256 _unitsToPay = unitsToPay[msg.sender];
        require(units <= _unitsToPay, "units-incorrect");
        _unitsToPay = _unitsToPay.sub(units);
        unitsToPay[msg.sender] = _unitsToPay;
        token.transfer(msg.sender, _unitsToPay);

        emit Withdraw(msg.sender, _unitsToPay);
    } 

    function changeBuyPrice(uint256 value)
        public
        onlyOwner
    {
        require(paused, "not-paused");
        buyPrice = value;
        emit ChangeBuyPrice(buyPrice);
    }

    function setPause(bool value)
        public
        onlyOwner
    {
        paused = value;
    }

    function getUnits() public view returns (uint256){
        return unitsToPay[msg.sender];
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