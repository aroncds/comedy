pragma solidity ^0.5.0;


library AddressUtils {
    function toPayable(address self) internal pure returns(address payable) {
        return address(uint160(self));
    }
}