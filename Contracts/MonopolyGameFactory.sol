// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MonopolyGame.sol";

contract MonopolyGameFactory {
    event GameCreated(address gameAddress, address player1, address player2);

    MonopolyGame[] public games;

    function createGame(address player1, address player2) external returns (address) {
        MonopolyGame newGame = new MonopolyGame();
        games.push(newGame);

        addDefaultProperties(newGame);
        // Initialize the game with the two players
        newGame.initializeGame(player1, player2);

        emit GameCreated(address(newGame), player1, player2);

        return address(newGame);
    }

function addDefaultProperties(MonopolyGame game) internal {
    game.addProperty("Mediterranean Avenue", 60, [uint256(2), 10, 30, 90, 160, 250]);
    game.addProperty("Baltic Avenue", 60, [uint256(4), 20, 60, 180, 320, 450]);

    // Light Blue properties
    game.addProperty("Oriental Avenue", 100, [uint256(6), 30, 90, 270, 400, 550]);
    game.addProperty("Vermont Avenue", 100, [uint256(6), 30, 90, 270, 400, 550]);
    game.addProperty("Connecticut Avenue", 120, [uint256(8), 40, 100, 300, 450, 600]);

    // Pink properties
    game.addProperty("St. Charles Place", 140, [uint256(10), 50, 150, 450, 625, 750]);
    game.addProperty("States Avenue", 140, [uint256(10), 50, 150, 450, 625, 750]);
    game.addProperty("Virginia Avenue", 160, [uint256(12), 60, 180, 500, 700, 900]);

    // Orange properties
    game.addProperty("St. James Place", 180, [uint256(14), 70, 200, 550, 750, 950]);
    game.addProperty("Tennessee Avenue", 180, [uint256(14), 70, 200, 550, 750, 950]);
    game.addProperty("New York Avenue", 200, [uint256(16), 80, 220, 600, 800, 1000]);

    // Red properties
    game.addProperty("Kentucky Avenue", 220, [uint256(18), 90, 250, 700, 875, 1050]);
    game.addProperty("Indiana Avenue", 220, [uint256(18), 90, 250, 700, 875, 1050]);
    game.addProperty("Illinois Avenue", 240, [uint256(20), 100, 300, 750, 925, 1100]);

    // Yellow properties
    game.addProperty("Atlantic Avenue", 260, [uint256(22), 110, 330, 800, 975, 1150]);
    game.addProperty("Ventnor Avenue", 260, [uint256(22), 110, 330, 800, 975, 1150]);
    game.addProperty("Marvin Gardens", 280, [uint256(24), 120, 360, 850, 1025, 1200]);

    // Green properties
    game.addProperty("Pacific Avenue", 300, [uint256(26), 130, 390, 900, 1100, 1275]);
    game.addProperty("North Carolina Avenue", 300, [uint256(26), 130, 390, 900, 1100, 1275]);
    game.addProperty("Pennsylvania Avenue", 320, [uint256(28), 150, 450, 1000, 1200, 1400]);

    // Dark Blue properties
    game.addProperty("Park Place", 350, [uint256(35), 175, 500, 1100, 1300, 1500]);
    game.addProperty("Boardwalk", 400, [uint256(50), 200, 600, 1400, 1700, 2000]);

    // Railroads (4)
    game.addProperty("Reading Railroad", 200, [uint256(25), 50, 100, 200, 200, 200]);
    game.addProperty("Pennsylvania Railroad", 200, [uint256(25), 50, 100, 200, 200, 200]);
    game.addProperty("B. & O. Railroad", 200, [uint256(25), 50, 100, 200, 200, 200]);
    game.addProperty("Short Line", 200, [uint256(25), 50, 100, 200, 200, 200]);

    // Utilities (2)
    game.addProperty("Electric Company", 150, [uint256(4), 10, 10, 10, 10, 10]);
    game.addProperty("Water Works", 150, [uint256(4), 10, 10, 10, 10, 10]);

    // Non-property spaces (8)
    game.addProperty("GO", 0, [uint256(0), 0, 0, 0, 0, 0]);
    game.addProperty("Community Chest", 0, [uint256(0), 0, 0, 0, 0, 0]);
    game.addProperty("Income Tax", 0, [uint256(200), 200, 200, 200, 200, 200]);
    game.addProperty("Chance", 0, [uint256(0), 0, 0, 0, 0, 0]);
    game.addProperty("Jail", 0, [uint256(0), 0, 0, 0, 0, 0]);
    game.addProperty("Free Parking", 0, [uint256(0), 0, 0, 0, 0, 0]);
    game.addProperty("Go to Jail", 0, [uint256(0), 0, 0, 0, 0, 0]);
    game.addProperty("Luxury Tax", 0, [uint256(75), 75, 75, 75, 75, 75]);
}

    function getGameCount() external view returns (uint256) {
        return games.length;
    }

    function getGameAtIndex(uint256 index) external view returns (MonopolyGame) {
        require(index < games.length, "Index out of bounds");
        return games[index];
    }
}