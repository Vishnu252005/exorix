// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Removed IERC721Errors import - not needed for revert strings

/**
 * @title QuestBadge
 * @dev An ERC721 token contract for non-transferable achievement badges (SBTs).
 * Made non-transferable (Soulbound) by overriding _update.
 * Uses OZ v5.x patterns based on community examples/docs.
 */
contract QuestBadge is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor(address initialOwner)
        ERC721("HackHazards Quest Badge", "HHQB")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory uri) public onlyOwner returns (uint256) {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        // The _update hook will be called internally by _safeMint
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /**
     * @dev See {ERC721-_update}.
     * Overridden to implement Soulbound (non-transferable) behavior for OZ v5.
     * Logic based on community examples for v5 SBTs.
     */
function _update(address to, uint256 tokenId, address auth)
    internal
    override(ERC721) // Override only the base ERC721 version
    returns (address)
{
    // Declare 'from' ONCE by getting the current owner.
    // This reverts if tokenId doesn't exist yet (which is fine for minting,
    // as the SBT check below won't run if from == 0).
    address from = _ownerOf(tokenId);

    // The core SBT check: revert if transferring between two non-zero addresses.
    if (from != address(0) && to != address(0)) {
        revert("QuestBadge: SBTs are non-transferable");
    }

    // Call the parent implementation AFTER the check (if it passed).
    return super._update(to, tokenId, auth);
}

     /**
     * @dev See {IERC721Metadata-tokenURI}.
     * Explicitly check existence before calling super, as per ERC721URIStorage standard behavior.
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage) // Needs both
        returns (string memory)
    {
        // _requireOwned calls _ownerOf which implicitly checks existence
        _requireOwned(tokenId);
        return super.tokenURI(tokenId);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage) // Needs both
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // --- NO OTHER OVERRIDES are needed ---
    // _beforeTokenTransfer, _burn, transferFrom etc. are not overridden.
}