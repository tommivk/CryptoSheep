// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SheepPasture {
    string start =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 20 20" shape-rendering="crispEdges"> <path stroke="#000000" d="';
    string fill =
        "M4 3h3M3 4h5M2 5h15M1 6h2M16 6h3M1 7h1M17 7h1M1 8h1M17 8h1M1 9h1M17 9h1M1 10h1M17 10h1M1 11h2M16 11h2M2 12h15M4 13h1M6 13h1M13 13h1M15 13h1M3 14h2M6 14h1M12 14h2M15 14h1M5 15h2M14 15h2";
    string end = "/></svg>";
    string happyFace = 'M4 7h1M6 7h1M3 9h1M7 9h1M3 10h5"';
    string neutralFace = 'M4 7h1M6 7h1M3 9h5"';
    string sadFace = 'M4 7h1M6 7h1M3 9h5M3 10h1M7 10h1"';

    uint public sheepCount;
    uint public sheepCost;

    struct Sheep {
        string name;
        uint16 level;
        uint64 lastFeedTime;
        uint8 concecutiveFeedingDays;
        bool isAlive;
    }

    Sheep[] public sheeps;

    mapping(uint => address) public sheepToOwner;

    constructor(uint _sheepCost) {
        sheepCount = 0;
        sheepCost = _sheepCost;
    }

    function buySheep(string memory _name) public payable {
        require(msg.value == sheepCost);
        sheeps.push(Sheep(_name, 0, uint64(block.timestamp), 0, true));
        uint id = sheeps.length - 1;
        sheepToOwner[id] = msg.sender;
        sheepCount++;
    }

    modifier onlySheepOwner(uint _sheepId) {
        require(sheepToOwner[_sheepId] == msg.sender);
        _;
    }

    function feed(uint _sheepId) public onlySheepOwner(_sheepId) {
        Sheep storage sheep = sheeps[_sheepId];
        require(sheep.isAlive);
        require((block.timestamp - sheep.lastFeedTime) > 1 days);

        if ((block.timestamp - sheep.lastFeedTime) > 3 days) {
            sheep.isAlive = false;
            return;
        }

        sheep.lastFeedTime = uint64(block.timestamp);
        sheep.concecutiveFeedingDays++;

        if (sheep.concecutiveFeedingDays == 7) {
            sheep.level++;
            sheep.concecutiveFeedingDays = 0;
        }
    }
}
