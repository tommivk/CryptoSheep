import { expect } from "chai";
import { ethers } from "hardhat";

const sheepColor = "#000000";

describe("Sheep tests", () => {
  it("Constructor should set correct data", async () => {
    const Sheeps = await ethers.getContractFactory("SheepContract");
    const sheeps = await Sheeps.deploy(200);

    const sheepCost = await sheeps.sheepCost();
    expect(sheepCost).to.equal(200);
  });

  it("Buying sheep should fail when insufficient amount is sent", async () => {
    const Sheeps = await ethers.getContractFactory("SheepContract");
    const sheeps = await Sheeps.deploy(200);

    await expect(
      sheeps.buySheep("mySheep", sheepColor)
    ).to.be.revertedWithoutReason();
    await expect(
      sheeps.buySheep("mySheep", sheepColor, {
        value: 199,
      })
    ).to.be.revertedWithoutReason();
  });

  it("Buying sheep should work and set correct sheep data", async () => {
    const [account] = await ethers.getSigners();

    const Sheeps = await ethers.getContractFactory("SheepContract");
    const sheeps = await Sheeps.deploy(200);

    await sheeps.buySheep("mySheep", sheepColor, { value: 200 });
    const sheep = await sheeps.sheeps(0);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);

    const sheepOwner = await sheeps.sheepToOwner(0);
    expect(sheepOwner).to.equal(account.address);

    expect(sheep.name).to.equal("mySheep");
    expect(sheep.color).to.equal(sheepColor);
    expect(sheep.concecutiveFeedingDays).to.equal(0);
    expect(sheep.level).to.equal(0);
    expect(sheep.lastFeedTime).to.not.equal(0);
    expect(sheep.lastFeedTime).to.equal(block.timestamp);
  });

  it("Feeding sheep should only be possible after 1 day", async () => {
    const oneDay = 1 * 24 * 60 * 60;

    const Sheeps = await ethers.getContractFactory("SheepContract");
    const sheeps = await Sheeps.deploy(200);
    await sheeps.buySheep("mySheep", sheepColor, { value: 200 });

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

    const Sheeps = await ethers.getContractFactory("SheepContract");
    const sheeps = await Sheeps.deploy(200);
    await sheeps.buySheep("mySheep", sheepColor, { value: 200 });

    await expect(sheeps.feed(0)).to.revertedWithoutReason();

    await ethers.provider.send("evm_increaseTime", [threeDays]);
    await ethers.provider.send("evm_mine", []);
    await expect(sheeps.feed(0)).to.revertedWith("Your sheep is dead :(");
  });

  it("Should not be possible to feed that you dont own", async () => {
    const [_accountA, accountB] = await ethers.getSigners();
    const Sheeps = await ethers.getContractFactory("SheepContract");
    const sheeps = await Sheeps.deploy(200);
    await sheeps.buySheep("mySheep", sheepColor, { value: 200 });

    const oneDay = 1 * 24 * 60 * 60;
    await ethers.provider.send("evm_increaseTime", [oneDay]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      sheeps.connect(accountB).feed(0)
    ).to.be.revertedWithoutReason();
  });

  it("Getting all owned sheeps should return correct data", async () => {
    const [_accountA, accountB] = await ethers.getSigners();
    const Sheeps = await ethers.getContractFactory("SheepContract");
    const sheeps = await Sheeps.deploy(200);

    await sheeps.buySheep("sheep", sheepColor, { value: 200 });
    await sheeps.buySheep("sheep2", sheepColor, { value: 200 });
    await sheeps
      .connect(accountB)
      .buySheep("sheep3", sheepColor, { value: 200 });

    const sheepsA = await sheeps.getOwnedSheeps();
    const sheepsB = await sheeps.connect(accountB).getOwnedSheeps();

    expect(sheepsA.length).to.equal(2);
    expect(sheepsA[0].name).to.equal("sheep");
    expect(sheepsA[0].color).to.equal(sheepColor);

    expect(sheepsA[1].name).to.equal("sheep2");
    expect(sheepsA[1].color).to.equal(sheepColor);

    expect(sheepsB.length).to.equal(1);
    expect(sheepsB[0].name).to.equal("sheep3");
  });
});
