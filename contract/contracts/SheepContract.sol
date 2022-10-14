// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./SheepPasture.sol";
import "./ERC721.sol";
import "./ERC721Receiver.sol";

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
        require(
            sheepToOwner[_tokenId] == msg.sender ||
                approvals[_tokenId] == msg.sender
        );
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId)
        external
        payable
        onlySheepOwner(_tokenId)
    {
        approvals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) external {}

    function getApproved(uint256 _tokenId) external view returns (address) {
        return approvals[_tokenId];
    }

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
