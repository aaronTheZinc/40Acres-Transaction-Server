import { ethers, network } from "hardhat";
import Wallet, { getGlobalWallet } from "../wallet";
const SENDER_WALLET_ID = "1132c229-2c22-4837-81af-2007f511a963";
const RECIPIENT_WALLET_ID = "9416ab92-beea-40ee-b417-d0c2cc70b086";

const TRANSACTION_AMOUNT = "0.05";

describe("Fund Ether", () => {
  it("Transfer Ether To Wallet", async () => {
    const sender = await Wallet.get(SENDER_WALLET_ID);
    const receiver = await Wallet.get(RECIPIENT_WALLET_ID);

    if (!receiver || !sender) throw new Error("wallet not found");

    console.log("Sender Address:", sender.address);
    console.log("Receiver Address:", receiver.address);

    // Check initial balances
    const senderBalanceBefore = await ethers.provider.getBalance(
      sender.address,
    );
    const receiverBalanceBefore = await ethers.provider.getBalance(
      receiver.address,
    );

    console.log(
      "Sender Balance Before:",
      ethers.formatEther(senderBalanceBefore),
    );
    console.log(
      "Receiver Balance Before:",
      ethers.formatEther(receiverBalanceBefore),
    );

    // Create a transaction
    const tx = await sender.sendTransaction({
      to: receiver.address,
      value: ethers.parseEther(TRANSACTION_AMOUNT),
    });

    console.log("Transaction Hash:", tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();

    // Check balances after the transaction
    const senderBalanceAfter = await ethers.provider.getBalance(sender.address);
    const receiverBalanceAfter = await ethers.provider.getBalance(
      receiver.address,
    );

    console.log(
      "Sender Balance After:",
      ethers.formatEther(senderBalanceAfter),
    );
    console.log(
      "Receiver Balance After:",
      ethers.formatEther(receiverBalanceAfter),
    );
    await network.provider.request({ method: "evm_mine", params: [] });
    console.log("[Block Forcefully Mined]");
  });
});
