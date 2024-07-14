// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";

import {PaymentManager} from "./PaymentManager.sol";
import {JobManager} from "./JobManager.sol";
import {PrinterManager} from "./PrinterManager.sol";
import {LoyaltyManager} from "./LoyaltyManager.sol";

contract XPrint is JobManager, PaymentManager, PrinterManager, LoyaltyManager, Ownable {

     constructor(address initialOwner)Ownable(initialOwner){}
    
    function registerPrinter(bytes32 printerHash, address owner, string memory cid) external {
        _registerPrinter(printerHash, owner, cid);
    }

    function issuePrint(bytes32 printerHash, address owner, uint amount, string memory docCID) external returns (bytes32) {
        require(isPrinter(printerHash), "Invalid printer");
        bytes32 printHash = _createJob(printerHash, owner, docCID);
        _makePayment(printHash, amount, owner);
        return printHash;
    }

    function markPrinted(bytes32 printHash, bytes32 printerHash, uint amount ) public onlyPrinterOwner(msg.sender, printerHash) onlyJobPrinterOwner(printHash, printerHash) {
         _updateJobStatus(printHash, printerHash, JobStatus.Printed);
        _claimPayment(printHash, amount);

    }

    function updateJobStatus(bytes32 printHash, bytes32 printerHash, JobStatus status) public onlyPrinterOwner(msg.sender, printerHash) onlyJobPrinterOwner(printHash, printerHash){
        _updateJobStatus(printHash, printerHash, status);
    }

    function setPaymentToken(address token_) external onlyOwner {
        _setPaymentToken(token_);
    }

     function setRedeemToken(address token) external onlyOwner {
        _setRedeemToken(token);
    }

    function setPrintPoint(uint point) external onlyOwner {
        _setPointRedeemPeriod(point);
    }

    function setValuePerPoint(uint value) external onlyOwner {
        _setValuePerPoint(value);
    }

}