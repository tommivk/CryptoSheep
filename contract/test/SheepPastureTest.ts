import { expect } from "chai";
import { ethers } from "hardhat";
import { SheepContract } from "../typechain-types";

const sheepCost = 200;
const sheepColors = [
  "#000000",
  "#d5cebe",
  "#35b9ca",
  "#40bf50",
  "#3744c8",
  "#e46f1b",
];

let Sheeps;
let sheeps: SheepContract;

beforeEach(async () => {
  Sheeps = await ethers.getContractFactory("SheepContract");
  sheeps = await Sheeps.deploy(sheepCost);
});

describe("Sheep tests", () => {
  it("Constructor should set correct data", async () => {
    let cost = await sheeps.sheepCost();
    expect(cost).to.equal(sheepCost);
  });

  it("Minting sheep should fail when insufficient amount is sent", async () => {
    await expect(
      sheeps.mint("mySheep", sheepColors[0])
    ).to.be.revertedWithoutReason();
    await expect(
      sheeps.mint("mySheep", sheepColors[0], {
        value: 199,
      })
    ).to.be.revertedWithoutReason();
  });

  it("Minting sheep should work and set correct sheep data", async () => {
    const [account] = await ethers.getSigners();

    await sheeps.mint("mySheep", sheepColors[0], { value: sheepCost });
    const sheep = await sheeps.sheeps(0);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);

    const sheepOwner = await sheeps.sheepToOwner(0);
    expect(sheepOwner).to.equal(account.address);

    expect(sheep.name).to.equal("mySheep");
    expect(sheep.color).to.equal(sheepColors[0]);
    expect(sheep.concecutiveFeedingDays).to.equal(0);
    expect(sheep.level).to.equal(1);
    expect(sheep.lastFeedTime).to.not.equal(0);
    expect(sheep.lastFeedTime).to.equal(block.timestamp);
  });

  it("Minting sheep should emit Transfer event with correct args", async () => {
    const [account] = await ethers.getSigners();
    await expect(
      await sheeps.mint("mySheep", sheepColors[0], { value: sheepCost })
    )
      .to.emit(sheeps, "Transfer")
      .withArgs(ethers.constants.AddressZero, account.address, "0");
    await expect(
      await sheeps.mint("mySheep", sheepColors[0], { value: sheepCost })
    )
      .to.emit(sheeps, "Transfer")
      .withArgs(ethers.constants.AddressZero, account.address, "1");
  });

  it("Minting sheep should not be possible with invalid color value", async () => {
    await expect(
      sheeps.mint("mySheep", "#123456", {
        value: sheepCost,
      })
    ).to.be.revertedWith("Invalid color");
    await expect(
      sheeps.mint("mySheep", "#00000", {
        value: sheepCost,
      })
    ).to.be.revertedWith("Invalid color");
    await expect(
      sheeps.mint("mySheep", "0", {
        value: sheepCost,
      })
    ).to.be.revertedWith("Invalid color");
  });

  it("Minting sheep should work with all the allowed colors", async () => {
    for (let i = 0; i < sheepColors.length; i++) {
      await sheeps.mint("mySheep", sheepColors[i], { value: sheepCost });
      expect((await sheeps.sheeps(i)).color).to.equal(sheepColors[i]);
    }
  });

  it("Minting sheep should not be possible when name is too long", async () => {
    let name = new Array(51 + 1).join("a");
    let nameSize = Buffer.from(name);
    expect(nameSize.length).to.equal(51);

    await expect(
      sheeps.mint(name, sheepColors[0], {
        value: sheepCost,
      })
    ).to.be.revertedWith("Maximum name size is 50 bytes");
  });

  it("Feeding sheep should only be possible after 1 day", async () => {
    const oneDay = 1 * 24 * 60 * 60;

    await sheeps.mint("mySheep", sheepColors[0], { value: sheepCost });

    await expect(sheeps.feed(0)).to.revertedWithoutReason();

    await ethers.provider.send("evm_increaseTime", [oneDay]);
    await ethers.provider.send("evm_mine", []);
    await sheeps.feed(0);

    const sheep = await sheeps.sheeps(0);
    expect(sheep.concecutiveFeedingDays).to.equal(1);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    expect(sheep.lastFeedTime).to.equal(block.timestamp);
  });

  it("Sheep should die if it has not been feeded in 3 days", async () => {
    const threeDays = 3 * 24 * 60 * 60;

    await sheeps.mint("mySheep", sheepColors[0], { value: sheepCost });

    await expect(sheeps.feed(0)).to.revertedWithoutReason();

    await ethers.provider.send("evm_increaseTime", [threeDays]);
    await ethers.provider.send("evm_mine", []);
    await expect(sheeps.feed(0)).to.revertedWith("Your sheep is dead :(");
  });

  it("Should not be possible to feed that you dont own", async () => {
    const [_accountA, accountB] = await ethers.getSigners();

    await sheeps.mint("mySheep", sheepColors[0], { value: sheepCost });

    const oneDay = 1 * 24 * 60 * 60;
    await ethers.provider.send("evm_increaseTime", [oneDay]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      sheeps.connect(accountB).feed(0)
    ).to.be.revertedWithoutReason();
  });

  it("Getting all owned sheeps should return correct data", async () => {
    const [_accountA, accountB] = await ethers.getSigners();

    await sheeps.mint("sheep", sheepColors[0], { value: sheepCost });
    await sheeps.mint("sheep2", sheepColors[0], { value: sheepCost });
    await sheeps
      .connect(accountB)
      .mint("sheep3", sheepColors[0], { value: sheepCost });

    const sheepsA = await sheeps.getOwnedSheeps();
    const sheepsB = await sheeps.connect(accountB).getOwnedSheeps();

    expect(sheepsA.length).to.equal(2);
    expect(sheepsA[0].name).to.equal("sheep");
    expect(sheepsA[0].color).to.equal(sheepColors[0]);

    expect(sheepsA[1].name).to.equal("sheep2");
    expect(sheepsA[1].color).to.equal(sheepColors[0]);

    expect(sheepsB.length).to.equal(1);
    expect(sheepsB[0].name).to.equal("sheep3");
  });
});
