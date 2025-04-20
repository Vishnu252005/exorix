const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy RewardToken
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  console.log("RewardToken deployed to:", await rewardToken.getAddress());

  // Deploy QuestBadge
  const QuestBadge = await hre.ethers.getContractFactory("QuestBadge");
  const questBadge = await QuestBadge.deploy(deployer.address);
  await questBadge.waitForDeployment();
  console.log("QuestBadge deployed to:", await questBadge.getAddress());

  // Deploy Distributor with RewardToken address
  const Distributor = await hre.ethers.getContractFactory("Distributor");
  const distributor = await Distributor.deploy(await rewardToken.getAddress(), deployer.address);
  await distributor.waitForDeployment();
  console.log("Distributor deployed to:", await distributor.getAddress());

  // Grant MINTER_ROLE to Distributor in RewardToken
  const tx = await rewardToken.mint(await distributor.getAddress(), hre.ethers.parseEther("1000000"));
  await tx.wait();
  console.log("Minted initial supply to Distributor");

  // Print all addresses for easy reference
  console.log("\nContract Addresses:");
  console.log("-------------------");
  console.log("RewardToken:", await rewardToken.getAddress());
  console.log("QuestBadge:", await questBadge.getAddress());
  console.log("Distributor:", await distributor.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 