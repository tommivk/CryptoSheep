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
        string color;
        uint16 level;
        uint64 lastFeedTime;
        uint8 concecutiveFeedingDays;
    }

    Sheep[] public sheeps;

    mapping(uint => address) public sheepToOwner;
    mapping(address => uint) public ownerSheepCount;

    string[] sheepColors = [
        "#000000",
        "#d5cebe",
        "#35b9ca",
        "#40bf50",
        "#3744c8",
        "#e46f1b"
    ];

    function getSheepColors() public view returns (string[] memory) {
        return sheepColors;
    }

    function totalSheepCount() public view returns (uint) {
        return sheeps.length;
    }

    event NewSheep(address indexed _owner, uint32 _sheepId, string _name);

    function buySheep(string memory _name, string memory _color)
        internal
        returns (uint32)
    {
        uint nameByteLength = bytes(_name).length;
        require(nameByteLength <= 50, "Maximum name size is 50 bytes");

        bool validColor = false;
        for (uint i; i < sheepColors.length; i++) {
            if (keccak256(bytes(sheepColors[i])) == keccak256(bytes(_color))) {
                validColor = true;
            }
        }
        require(validColor, "Invalid color");

        uint32 sheepId = uint32(sheeps.length);
        sheeps.push(
            Sheep(sheepId, _name, _color, 1, uint64(block.timestamp), 0)
        );
        sheepToOwner[sheepId] = msg.sender;
        ownerSheepCount[msg.sender]++;
        emit NewSheep(msg.sender, sheepId, _name);
        return sheepId;
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
            return
                string.concat(
                    SVGStart,
                    SVGPathStart,
                    sheep.color,
                    SVGPath,
                    happyFace,
                    SVGEnd
                );
        }
        if ((block.timestamp - sheep.lastFeedTime) < 2 days) {
            return
                string.concat(
                    SVGStart,
                    SVGPathStart,
                    sheep.color,
                    SVGPath,
                    neutralFace,
                    SVGEnd
                );
        }
        return
            string.concat(
                SVGStart,
                SVGPathStart,
                sheep.color,
                SVGPath,
                sadFace,
                SVGEnd
            );
    }

    struct SheepResponse {
        uint32 id;
        address owner;
        string name;
        uint16 level;
        uint64 lastFeedTime;
        uint8 concecutiveFeedingDays;
        bool isAlive;
        string svg;
        string color;
    }

    function getSheep(uint _sheepId)
        public
        view
        returns (SheepResponse memory)
    {
        Sheep memory sheep = sheeps[_sheepId];
        SheepResponse memory sheepData;

        sheepData.id = sheep.id;
        sheepData.owner = sheepToOwner[sheep.id];
        sheepData.name = sheep.name;
        sheepData.color = sheep.color;
        sheepData.level = sheep.level;
        sheepData.lastFeedTime = sheep.lastFeedTime;
        sheepData.concecutiveFeedingDays = sheep.concecutiveFeedingDays;
        sheepData.isAlive = checkIsAlive(sheep);
        sheepData.svg = getSheepSVG(_sheepId);

        return sheepData;
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
                sheepData.color = sheep.color;
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
