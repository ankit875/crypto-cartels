// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Property {
    string public name;
    uint256 public id;
    uint256 public price;
    uint256[6] public rentLevels;
    address public owner;
    uint256 public currentLevel;

    constructor(
        string memory _name,
        uint256 _id,
        uint256 _price,
        uint256[6] memory _rentLevels
    ) {
        name = _name;
        id = _id;
        price = _price;
        rentLevels = _rentLevels;
        owner = address(0);
        currentLevel = 0;
    }

    function purchase(address _buyer) external {
        require(owner == address(0), "Property already owned");
        owner = _buyer;
    }

    function upgrade() external {
        require(currentLevel < 5, "Property already at maximum level");
        currentLevel++;
    }

    function getRent() external view returns (uint256) {
        return rentLevels[currentLevel];
    }
}
