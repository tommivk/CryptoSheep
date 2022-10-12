// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SheepPasture {
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
