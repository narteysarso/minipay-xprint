// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;


import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
    NB: printHash is calculated from both the printerServiceHash, and documentHash 
    This contract handles all payment related issues

    - holds printing cost
    - handles refunds
    - handles payment claims
*/

error ZeroAddress();
error InvalidAddress();
error ZeroAmount();
error InsufficientAmount();
error InvalidToken();

contract PaymentManager {
    event PaymentLocked(bytes32 indexed printHash, address indexed owner, uint amount);
    event RefundRequested(bytes32 indexed printHash, address indexed owner, uint amount);

    address private token = address(0x0); // this is cUSD address on celo
    enum PaymentStatus {
        None,
        FundLocked,
        FundRealeased,
        ClaimPending,
        Claimed,
        RefundPending,
        Refunded
    }

    mapping(bytes32 printHash => uint256) printBalances;

    mapping(bytes32 printHash => PaymentStatus) paymentStatuses;

    modifier onlyPaymentStatus(bytes32 printHash, PaymentStatus status){
        require(paymentStatuses[printHash] == status, "Invalid payment action");
        _;
    }

    // This function should be called only after msg.sender has approved allowance
    // printHash should be verified before calling this function 
    function _makePayment(bytes32 printHash, uint amount, address sender) internal virtual onlyPaymentStatus(printHash, PaymentStatus.None) {
        if(amount < 1)  revert ZeroAmount();
        if(token == address(this)) revert InvalidAddress();

        SafeERC20.safeTransferFrom(IERC20(token), sender, address(this), amount );

        printBalances[printHash] = amount;
        paymentStatuses[printHash] = PaymentStatus.FundLocked;

        emit PaymentLocked(printHash, sender, amount );

    }

    // printHash should be verified before calling this function 
    // msg.sender must be verified to be print owner before calling this function
    // printHash must be verified to be not printed before calling this function
    function _requestRefund(bytes32 printHash, uint amount) internal virtual onlyPaymentStatus(printHash, PaymentStatus.FundLocked) {
        if(printBalances[printHash] < amount) revert InsufficientAmount();
        
        SafeERC20.forceApprove(IERC20(token), msg.sender, amount);
        paymentStatuses[printHash] = PaymentStatus.RefundPending;

        emit RefundRequested(printHash, msg.sender, amount);
    }

    // printHash should be verified before calling this function 
    // msg.sender must be verified to be print printer before calling this function
    // printHash must be confirmed to be not printed
    function _claimPayment(bytes32 printHash, uint amount) internal virtual onlyPaymentStatus(printHash, PaymentStatus.FundLocked) {
        if(printBalances[printHash] < amount) revert InsufficientAmount();
        
        paymentStatuses[printHash] = PaymentStatus.RefundPending;
        SafeERC20.forceApprove(IERC20(token), msg.sender, amount);

        emit RefundRequested(printHash, msg.sender, amount);
    }

    function _setPaymentToken(address token_) internal virtual {
        if(token_ == address(0)) revert ZeroAddress();
        if(token_ == address(this)) revert InvalidAddress();
        token = token_;
    }

    function getPaymentToken() external view returns (address){
        return token;
    }

    function getPrintBalance(bytes32 printHash) external view returns(uint) {
        return printBalances[printHash];
    }



}