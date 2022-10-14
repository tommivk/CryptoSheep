// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./SheepPasture.sol";
import "./ERC721.sol";

contract SheepContract is SheepPasture, ERC721 {
    mapping(uint => address) approvals;

    constructor(uint _sheepCost) {
        sheepCost = _sheepCost;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return ownerSheepCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return sheepToOwner[_tokenId];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata data
    ) external payable {}

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {}

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external payable {}

    function approve(address _approved, uint256 _tokenId) external payable {}

    function setApprovalForAll(address _operator, bool _approved) external {}

    function getApproved(uint256 _tokenId) external view returns (address) {}

    function isApprovedForAll(address _owner, address _operator)
        external
        view
        returns (bool)
    {}

    function supportsInterface(bytes4 interfaceID)
        external
        view
        returns (bool)
    {}
}
