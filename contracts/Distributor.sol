// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Distributor is Ownable {
    IERC20 public rewardToken;

    constructor(address _tokenAddress, address _initialOwner) Ownable(_initialOwner) {
        rewardToken = IERC20(_tokenAddress);
    }

    function distributeRewards(address recipient, uint256 amount) public onlyOwner {
        require(rewardToken.transfer(recipient, amount), "Transfer failed");
    }
}
