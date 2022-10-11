// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SheepPasture {
    uint public sheepCount;
    uint public sheepCost;

    struct Sheep {
        string name;
        uint16 level;
    }

    Sheep[] public sheeps;

    mapping(uint => address) public sheepToOwner;

    constructor(uint _sheepCost) {
        sheepCount = 0;
        sheepCost = _sheepCost;
    }

    function buySheep(string memory _name) public payable {
        require(msg.value == sheepCost);
        sheeps.push(Sheep(_name, 0));
        uint id = sheeps.length - 1;
        sheepToOwner[id] = msg.sender;
        sheepCount++;
    }
}
