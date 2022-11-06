// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./SheepPasture.sol";

import "./ERC721.sol";
import "./ERC721Receiver.sol";
import "./ERC721Metadata.sol";

import "./Base64.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract SheepContract is SheepPasture, ERC721, ERC721Metadata {
    mapping(uint => address) approvals;
    mapping(address => mapping(address => bool)) authorized;

    constructor(uint _sheepCost) {
        sheepCost = _sheepCost;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerSheepCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return sheepToOwner[_tokenId];
    }

    function mint(string memory _name, string memory _color) public payable {
        require(msg.value >= sheepCost);
        uint tokenId = buySheep(_name, _color);
        emit Transfer(address(0), msg.sender, tokenId);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory data
    ) public payable {
        transferFrom(_from, _to, _tokenId);

        //Get size of "_to" address, if 0 it's a wallet
        uint32 size;
        assembly {
            size := extcodesize(_to)
        }
        if (size > 0) {
            ERC721TokenReceiver receiver = ERC721TokenReceiver(_to);
            require(
                receiver.onERC721Received(msg.sender, _from, _tokenId, data) ==
                    bytes4(
                        keccak256(
                            "onERC721Received(address,address,uint256,bytes)"
                        )
                    )
            );
        }
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {
        safeTransferFrom(_from, _to, _tokenId, "");
    }

    function _transfer(
        address _from,
        address _to,
        uint _tokenId
    ) private {
        require(_from == sheepToOwner[_tokenId]);
        require(_to != address(0));
        require(_from != _to);

        sheepToOwner[_tokenId] = _to;
        ownerSheepCount[_from]--;
        ownerSheepCount[_to]++;
        emit Transfer(_from, _to, _tokenId);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public payable {
        address owner = sheepToOwner[_tokenId];
        require(
            owner == msg.sender ||
                approvals[_tokenId] == msg.sender ||
                authorized[owner][msg.sender]
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable {
        address owner = sheepToOwner[_tokenId];
        require(owner == msg.sender || authorized[owner][msg.sender]);
        approvals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        authorized[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function getApproved(uint256 _tokenId) external view returns (address) {
        return approvals[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool)
    {
        return authorized[_owner][_operator];
    }

    function name() external pure returns (string memory _name) {
        return "Sheep NFT";
    }

    function symbol() external pure returns (string memory _symbol) {
        return "SHEEP";
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        Sheep memory sheep = sheeps[_tokenId];

        string memory svgData = getSheepSVG(_tokenId);
        string memory status = checkIsAlive(sheep) ? "Alive" : "Dead";
        string memory title = string(
            abi.encodePacked("Sheep #", Strings.toString(sheep.id))
        );

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            string(
                                abi.encodePacked(
                                    '{"name": "',
                                    title,
                                    '", "description": "',
                                    "Sheep NFT",
                                    '",'
                                    '"image_data": "',
                                    bytes(svgData),
                                    '",',
                                    '"attributes": [{"trait_type": "Name", "value": ',
                                    '"',
                                    sheep.name,
                                    '"',
                                    "},",
                                    '{"trait_type": "Status", "value": ',
                                    '"',
                                    status,
                                    '"',
                                    "},",
                                    '{"trait_type": "Color", "value": ',
                                    '"',
                                    sheep.color,
                                    '"',
                                    "},",
                                    '{"trait_type": "Level", "value": ',
                                    Strings.toString(sheep.level),
                                    "},",
                                    '{"display_type": "date", "trait_type": "Last fed", "value": ',
                                    Strings.toString(
                                        uint256(sheep.lastFeedTime)
                                    ),
                                    "}"
                                    "]}"
                                )
                            )
                        )
                    )
                )
            );
    }

    bytes4 ERC721_ID = 0x80ac58cd;
    bytes4 ERC721Metadata_ID = 0x5b5e139f;

    function supportsInterface(bytes4 _interfaceID)
        external
        view
        returns (bool)
    {
        return _interfaceID == ERC721_ID || _interfaceID == ERC721Metadata_ID;
    }
}
