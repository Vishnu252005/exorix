// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor(address initialOwner) 
        ERC20("AdReward", "ADR") 
        Ownable(initialOwner) 
    {
        // Mint an initial supply of 1,000,000 tokens (accounting for 18 decimals) to the initialOwner
        _mint(initialOwner, 1_000_000 * 10 ** decimals());
    }

    // Owner-only function to mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
