// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./SheepSVG.sol";

contract SheepPasture is SheepSVG {
    uint public sheepCost;
    uint public feedingDeadline = 3 days;
    uint public feedingUnlock = 1 days;

    struct Sheep {
        uint32 id;
        string name;
        uint16 level;
        uint64 lastFeedTime;
        uint8 concecutiveFeedingDays;
    }

    Sheep[] public sheeps;

    mapping(uint => address) public sheepToOwner;
    mapping(address => uint) public ownerSheepCount;

    event NewSheep(address indexed _owner, uint32 _sheepId, string _name);

    function buySheep(string memory _name) public payable {
        require(msg.value == sheepCost);
        uint32 id = uint32(sheeps.length);
        sheeps.push(Sheep(id, _name, 0, uint64(block.timestamp), 0));
        sheepToOwner[id] = msg.sender;
        ownerSheepCount[msg.sender]++;
        emit NewSheep(msg.sender, id, _name);
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

        require((block.timestamp - sheep.lastFeedTime) > feedingUnlock);
        require(
            (block.timestamp - sheep.lastFeedTime) < feedingDeadline,
            "Your sheep is dead :("
        );

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

    struct SheepResponse {
        uint32 id;
        string name;
        uint16 level;
        uint64 lastFeedTime;
        uint8 concecutiveFeedingDays;
        bool isAlive;
        string svg;
    }

    function getOwnedSheeps() public view returns (SheepResponse[] memory) {
        uint sheepCount = ownerSheepCount[msg.sender];
        SheepResponse[] memory result = new SheepResponse[](sheepCount);

        uint index = 0;

        for (uint i = 0; i < sheeps.length; i++) {
            if (sheepToOwner[i] == msg.sender) {
                Sheep memory sheep = sheeps[i];
                SheepResponse memory sheepData;

                sheepData.id = sheep.id;
                sheepData.name = sheep.name;
                sheepData.level = sheep.level;
                sheepData.lastFeedTime = sheep.lastFeedTime;
                sheepData.concecutiveFeedingDays = sheep.concecutiveFeedingDays;
                sheepData.isAlive = checkIsAlive(sheep);
                sheepData.svg = getSheepSVG(i);

                result[index] = sheepData;
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
