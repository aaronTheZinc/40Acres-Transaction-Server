import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("FractionalHouseNFT", () => {
  async function deployFractionalHouseNFT() {
    const signers = await hre.ethers.getSigners();
    const [owner, otherAccount] = signers;

    console.log("[Signers]", signers.length);

    const FractionalHouseNFT =
      await hre.ethers.getContractFactory("FractionalProperty");

    const fractionalProperty = await FractionalHouseNFT.deploy(
      "Property NFT",
      "PROP",
    );

    return {
      fractionalProperty,
      owner,
      otherAccount,
    };
  }

  it("Should deploy Fractional House NFT", async function () {
    const { fractionalProperty } = await deployFractionalHouseNFT();
    const receipt = await fractionalProperty.deploymentTransaction()?.wait();
    console.log("[Contract Address] ", receipt?.contractAddress);
    expect(receipt?.status).equal(1);
  });
});
