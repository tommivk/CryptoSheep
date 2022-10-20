// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./SheepSVG.sol";

contract SheepPasture is SheepSVG {
    uint public sheepCost;
    uint feedingDeadline = 3 days;

    struct Sheep {
        uint32 id;
        string name;
        uint16 level;
        uint64 lastFeedTime;
        uint8 concecutiveFeedingDays;
        bool isAlive;
    }

    Sheep[] public sheeps;

    mapping(uint => address) public sheepToOwner;
    mapping(address => uint) public ownerSheepCount;

    function buySheep(string memory _name) public payable {
        require(msg.value == sheepCost);
        uint32 id = uint32(sheeps.length);
        sheeps.push(Sheep(id, _name, 0, uint64(block.timestamp), 0, true));
        sheepToOwner[id] = msg.sender;
        ownerSheepCount[msg.sender]++;
    }

    modifier onlySheepOwner(uint _sheepId) {
        require(sheepToOwner[_sheepId] == msg.sender);
        _;
    }

    function feed(uint _sheepId)
        public
        onlySheepOwner(_sheepId)
        returns (bool)
    {
        Sheep storage sheep = sheeps[_sheepId];
        require(sheep.isAlive);
        require((block.timestamp - sheep.lastFeedTime) > 1 days);

        if ((block.timestamp - sheep.lastFeedTime) > feedingDeadline) {
            sheep.isAlive = false;
            return false;
        }

        sheep.lastFeedTime = uint64(block.timestamp);
        sheep.concecutiveFeedingDays++;

        if (sheep.concecutiveFeedingDays == 7) {
            sheep.level++;
            sheep.concecutiveFeedingDays = 0;
        }
        return true;
    }

    function getSheepSVG(uint _sheepId) public view returns (string memory) {
        require(_sheepId < sheeps.length);
        Sheep memory sheep = sheeps[_sheepId];

        if ((block.timestamp - sheep.lastFeedTime) < 1 days) {
            return string.concat(SVGStart, SVGPath, happyFace, SVGEnd);
        }
        if ((block.timestamp - sheep.lastFeedTime) < 2 days) {
            return string.concat(SVGStart, SVGPath, neutralFace, SVGEnd);
        }
        return string.concat(SVGStart, SVGPath, sadFace, SVGEnd);
    }

    function getOwnedSheeps() public view returns (Sheep[] memory) {
        uint sheepCount = ownerSheepCount[msg.sender];
        Sheep[] memory result = new Sheep[](sheepCount);

        uint index = 0;

        for (uint i = 0; i < sheeps.length; i++) {
            if (sheepToOwner[i] == msg.sender) {
                Sheep memory sheep = sheeps[i];
                sheep.isAlive = sheep.isAlive ? checkIsAlive(sheep) : false;
                result[index] = sheep;
                index++;
            }
            if (index == sheepCount) {
                break;
            }
        }

        return result;
    }

    function checkIsAlive(Sheep memory _sheep) internal view returns (bool) {
        if ((block.timestamp - _sheep.lastFeedTime) > feedingDeadline) {
            return false;
        }
        return true;
    }
}
