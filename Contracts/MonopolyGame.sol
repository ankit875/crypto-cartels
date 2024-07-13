// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Property.sol";

contract MonopolyGame {
    struct Player {
        address addr;
        uint256 balance;
        uint256 position;
    }

    Property[] public properties;
    Player[2] public players;
    uint256 public currentPlayerIndex;
    bool public gameStarted;
    bool public gameEnded;

    event PropertyPurchased(address player, uint256 propertyId);
    event RentPaid(address from, address to, uint256 amount);
    event PlayerMoved(address player, uint256 newPosition);
    event GameOver(address winner);

    constructor() {
        gameStarted = false;
        gameEnded = false;
    }

    function initializeGame(address player1, address player2) external {
        require(!gameStarted, "Game has already started");
        players[0] = Player(player1, 1500, 0); // Starting balance of 1500
        players[1] = Player(player2, 1500, 0);
        currentPlayerIndex = 0;
        gameStarted = true;
    }

    function addProperty(
        string memory _name,
        uint256 _price,
        uint256[6] memory _rentLevels
    ) external {
        require(!gameStarted, "Cannot add properties after game has started");
        Property newProperty = new Property(_name, properties.length, _price, _rentLevels);
        properties.push(newProperty);
    }

    function rollDiceAndMove() external {
        require(gameStarted && !gameEnded, "Game not in progress");
        require(msg.sender == players[currentPlayerIndex].addr, "Not your turn");

        // Simulating dice roll (1-6)
        uint256 diceRoll = (block.timestamp % 6) + 1;
        players[currentPlayerIndex].position = (players[currentPlayerIndex].position + diceRoll) % properties.length;

        emit PlayerMoved(msg.sender, players[currentPlayerIndex].position);

        // Handle landing on property
        handleLanding();

        // Switch to next player
        currentPlayerIndex = 1 - currentPlayerIndex;
    }

    function handleLanding() internal {
        uint256 propertyIndex = players[currentPlayerIndex].position;
        Property currentProperty = properties[propertyIndex];

        if (currentProperty.owner() == address(0)) {
            // Property not owned, can be purchased
            // Implement purchase logic here
        } else if (currentProperty.owner() != players[currentPlayerIndex].addr) {
            // Pay rent
            uint256 rentAmount = currentProperty.getRent();
            require(players[currentPlayerIndex].balance >= rentAmount, "Not enough balance to pay rent");

            players[currentPlayerIndex].balance -= rentAmount;
            Player storage propertyOwner = players[currentProperty.owner() == players[0].addr ? 0 : 1];
            propertyOwner.balance += rentAmount;

            emit RentPaid(players[currentPlayerIndex].addr, currentProperty.owner(), rentAmount);

            if (players[currentPlayerIndex].balance == 0) {
                gameEnded = true;
                emit GameOver(propertyOwner.addr);
            }
        }
    }

    function purchaseProperty() external {
        require(gameStarted && !gameEnded, "Game not in progress");
        require(msg.sender == players[currentPlayerIndex].addr, "Not your turn");

        uint256 propertyIndex = players[currentPlayerIndex].position;
        Property currentProperty = properties[propertyIndex];

        require(currentProperty.owner() == address(0), "Property already owned");
        require(players[currentPlayerIndex].balance >= currentProperty.price(), "Not enough balance to purchase");

        players[currentPlayerIndex].balance -= currentProperty.price();
        currentProperty.purchase(msg.sender);

        emit PropertyPurchased(msg.sender, propertyIndex);
    }

    function getPropertyAtIndex(uint256 index) external view returns (Property) {
        require(index < properties.length, "Index out of bounds");
        return properties[index];
    }

}