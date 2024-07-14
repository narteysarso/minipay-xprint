// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

/**
    This contract register printers
*/
contract PrinterManager {
    event PrinterCreated(address indexed owner, bytes32 indexed printerHash, string cid);
    event PrinterRemoved(address indexed owner, bytes32 indexed printerHash);
    
    mapping(bytes32 => address) printersOwners;
    mapping(bytes32 => bool) printers;

    modifier onlyPrinterOwner(address owner, bytes32 printerHash){
        require(getPrinterOwner(printerHash) == owner, "Only printer owner");
        _;
    }

    function _registerPrinter(bytes32 printerHash, address owner, string memory cid) internal virtual {
        require(owner != address(this), "Invalid owner");
        printers[printerHash] = true;
        printersOwners[printerHash] = owner;
        emit PrinterCreated(owner, printerHash, cid);
    }

    function _removePrinter(bytes32 printerHash) internal virtual onlyPrinterOwner(msg.sender, printerHash) {
        printers[printerHash] = false;
        printersOwners[printerHash] = address(0x0);
    }

    function getPrinterhash(bytes memory printerDetails) public pure returns(bytes32){
        return keccak256(printerDetails);
    }

    function getPrinterOwner(bytes32 printerHash) public view returns(address){
        return printersOwners[printerHash];
    }

    function isPrinter(bytes32 printerHash) public view returns(bool){
        return printers[printerHash];
    }


}