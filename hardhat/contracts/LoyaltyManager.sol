//SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LoyaltyManager{
    uint public printPoint = 5;
    uint public valuePerPoint = 1;
    uint public redeemPeriod;
    address public redeemToken;
    mapping(address => uint ) accummulatedPoints;

    modifier onlyRedeemPeriod(){
        require(block.timestamp < redeemPeriod, "Points are not redeemable");
        _;
    }

    function _setRedeemToken(address token) internal {
        require(token != address(0) && token != address(this),"Invalid redeem address");
        redeemToken = token;
    }

    function _setPrintPoint(uint point) internal {
        require(point > 0, "Point must be greater than zero");
        printPoint = point;
    }

    function _setValuePerPoint(uint value) internal {
        require(value > 0, "Value must be greater than zero");
        valuePerPoint = value;
    }

    function _assignPoint(address to) internal {
        accummulatedPoints[to] += printPoint;
    }

    function _setPointRedeemPeriod(uint time) internal {
        redeemPeriod = block.timestamp + time;
    }

    function _reedemable(uint points, address to) internal view returns (uint){
        require(points < accummulatedPoints[to], "Amount is more than redeemable points");
        return points * valuePerPoint;
    }


    function _redeem(uint points, address to) internal virtual onlyRedeemPeriod {
        require(to != address(0) && to != address(this));
        uint redeemableValue = _reedemable(points, to);
        require(redeemableValue > 0);
        
        accummulatedPoints[to] -= points;
        SafeERC20.safeTransfer(IERC20(redeemToken),to, redeemableValue);
    }

}