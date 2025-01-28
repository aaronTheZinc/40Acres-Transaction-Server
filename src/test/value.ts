import { ethers } from "hardhat";

const TOKEN_ADDRESS = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";

describe("Get Token Starting Price", () => {
  it("Get Token Initial Price", async () => {
    const token = await ethers.getContractAt("FractionalToken", TOKEN_ADDRESS);
    const sharePrice = await token.sharePrice();
    console.log("[Share Price]", ethers.formatEther(sharePrice));
  });
});
