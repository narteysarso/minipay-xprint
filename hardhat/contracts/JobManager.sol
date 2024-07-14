// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;


/**
This contract maps a job to a printer
*/

contract JobManager {

    enum JobStatus {
        None,
        Pending,
        Printing,
        Printed,
        Queued,
        PrintCancelled,
        OwnerCancelRequest
    }

    event JobIssued(address indexed owner, bytes32 indexed printHash, bytes32 indexed printerHash, string docHash);
    event RequestPrintCancel(address indexed owner, bytes32 indexed printHash, bytes32 indexed printerHash);
    event PrintCancelled(bytes32 indexed printHash, bytes32 indexed printerHash);

    mapping(bytes32 hash => JobStatus) jobStatuses;
    mapping(bytes32 hash => address) jobOwners;
    mapping(bytes32 hash => bytes32 printerHash) jobPrinters;


    modifier onlyPrintOwner(bytes32 printHash, address owner){
        require(owner == jobOwners[printHash], "Not print owner");
        _;
    }
    modifier onlyJobPrinterOwner(bytes32 printHash, bytes32 printerHash){
        require(printerHash == jobPrinters[printHash], "Not printer owner");
        _;
    }

    modifier onlyJobStatus(bytes32 printHash, JobStatus status){
        require(jobStatuses[printHash] == status);
        _;
    }

    function _createJob(bytes32 printerHash, address owner, string memory docCID) internal virtual returns (bytes32) {
        require(owner != address(this));
        bytes32 printHash = getJobHash( printerHash, docCID);
        jobStatuses[printHash] = JobStatus.Pending;
        jobOwners[printHash] = owner;
        jobPrinters[printHash] = printerHash;
        emit JobIssued(owner,printHash, printerHash, docCID );
        return printHash;
    }

    // verify printHash before calling this function
    function _updateJobStatus(bytes32 printHash, bytes32 printerHash, JobStatus status) internal virtual onlyJobPrinterOwner(printHash, printerHash){
        jobStatuses[printHash] = status;
    }

    function isPrintJob(bytes32 printHash) public view returns (bool){
        return jobStatuses[printHash] != JobStatus.None;
    }

    function isPrinted(bytes32 printHash) public view returns (bool){
        return jobStatuses[printHash] != JobStatus.Printed;
    }

    function userRequestPrintCancel(bytes32 printHash, bytes32 printerHash) public onlyPrintOwner(printHash, msg.sender) {
        require(isPrintJob(printHash), "Invalid print hash");
        jobStatuses[printHash] = JobStatus.OwnerCancelRequest;
        
        emit RequestPrintCancel(msg.sender, printHash, printerHash);
    }


    // verify printer hash before calling this function
    function _ackPrintCancel(bytes32 printHash, bytes32 printerHash) internal virtual onlyJobPrinterOwner(printHash, printerHash) onlyJobStatus(printerHash, JobStatus.OwnerCancelRequest){
        require(isPrintJob(printHash), "Invalid print hash");
        jobStatuses[printHash] = JobStatus.PrintCancelled;
        
        emit PrintCancelled(printHash, printerHash);
    }

    function getPrintHashOwner(bytes32 hash) public view returns (address){
        return jobOwners[hash];
    }

    function getPrintHashPrinter(bytes32 hash) public view returns (bytes32) {
        return jobPrinters[hash];
    }
    
    function getJobStatus(bytes32 printHash) public view returns (JobStatus){
        return jobStatuses[printHash];
    }

    function getJobHash(bytes32 printerHash, string memory docCID) internal pure returns (bytes32){
        return keccak256(abi.encodePacked(docCID, printerHash));
    }

}