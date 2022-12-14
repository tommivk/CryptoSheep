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

let Sheep;
let contract: SheepContract;

beforeEach(async () => {
  Sheep = await ethers.getContractFactory("SheepContract");
  contract = await Sheep.deploy(sheepCost);
});

describe("Sheep tests", () => {
  it("Constructor should set correct data", async () => {
    let cost = await contract.sheepCost();
    expect(cost).to.equal(sheepCost);
  });

  it("Minting sheep should fail when insufficient amount is sent", async () => {
    await expect(
      contract.mint("mySheep", sheepColors[0])
    ).to.be.revertedWithoutReason();
    await expect(
      contract.mint("mySheep", sheepColors[0], {
        value: 199,
      })
    ).to.be.revertedWithoutReason();
  });

  it("Minting sheep should work and set correct sheep data", async () => {
    const [account] = await ethers.getSigners();

    await contract.mint("mySheep", sheepColors[0], { value: sheepCost });
    const sheep = await contract.allSheep(0);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);

    const sheepOwner = await contract.sheepToOwner(0);
    expect(sheepOwner).to.equal(account.address);

    expect(sheep.name).to.equal("mySheep");
    expect(sheep.color).to.equal(sheepColors[0]);
    expect(sheep.timesFed).to.equal(0);
    expect(sheep.level).to.equal(1);
    expect(sheep.lastFeedTime).to.not.equal(0);
    expect(sheep.lastFeedTime).to.equal(block.timestamp);
  });

  it("Minting sheep should emit Transfer event with correct args", async () => {
    const [account] = await ethers.getSigners();
    await expect(
      await contract.mint("mySheep", sheepColors[0], { value: sheepCost })
    )
      .to.emit(contract, "Transfer")
      .withArgs(ethers.constants.AddressZero, account.address, "0");
    await expect(
      await contract.mint("mySheep", sheepColors[0], { value: sheepCost })
    )
      .to.emit(contract, "Transfer")
      .withArgs(ethers.constants.AddressZero, account.address, "1");
  });

  it("Minting sheep should not be possible with invalid color value", async () => {
    await expect(
      contract.mint("mySheep", "#123456", {
        value: sheepCost,
      })
    ).to.be.revertedWith("Invalid color");
    await expect(
      contract.mint("mySheep", "#00000", {
        value: sheepCost,
      })
    ).to.be.revertedWith("Invalid color");
    await expect(
      contract.mint("mySheep", "0", {
        value: sheepCost,
      })
    ).to.be.revertedWith("Invalid color");
  });

  it("Minting sheep should work with all the allowed colors", async () => {
    for (let i = 0; i < sheepColors.length; i++) {
      await contract.mint("mySheep", sheepColors[i], { value: sheepCost });
      expect((await contract.allSheep(i)).color).to.equal(sheepColors[i]);
    }
  });

  it("Minting sheep should not be possible when name is too long", async () => {
    let name = new Array(51 + 1).join("a");
    let nameSize = Buffer.from(name);
    expect(nameSize.length).to.equal(51);

    await expect(
      contract.mint(name, sheepColors[0], {
        value: sheepCost,
      })
    ).to.be.revertedWith("Maximum name size is 50 bytes");
  });

  it("Feeding sheep should be possible after minting sheep without waiting", async () => {
    await contract.mint("mySheep", sheepColors[0], { value: sheepCost });

    await contract.feed(0);
    const sheep = await contract.allSheep(0);
    expect(sheep.timesFed).to.equal(1);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    expect(sheep.lastFeedTime).to.equal(block.timestamp);
  });

  it("Feeding should not be possible without waiting 1 day between feedings", async () => {
    const oneDay = 1 * 24 * 60 * 60;
    await contract.mint("mySheep", sheepColors[0], { value: sheepCost });
    await contract.feed(0);

    await expect(contract.feed(0)).to.revertedWithoutReason();

    await increaseTime(oneDay);
    await contract.feed(0);
    let sheep = await contract.allSheep(0);
    expect(sheep.timesFed).to.equal(2);

    await expect(contract.feed(0)).to.revertedWithoutReason();
    await increaseTime(oneDay - 30);
    await expect(contract.feed(0)).to.revertedWithoutReason();
    await increaseTime(30);
    await contract.feed(0);
    sheep = await contract.allSheep(0);
    expect(sheep.timesFed).to.equal(3);
  });

  it("Sheep level should increase after every 3 feeding", async () => {
    const oneDay = 1 * 24 * 60 * 60;
    await contract.mint("mySheep", sheepColors[0], { value: sheepCost });
    await contract.feed(0);
    await increaseTime(oneDay);

    await contract.feed(0);
    let sheep = await contract.allSheep(0);
    expect(sheep.level).to.equal(1);

    await increaseTime(oneDay);

    await contract.feed(0);
    sheep = await contract.allSheep(0);
    expect(sheep.level).to.equal(2);

    await increaseTime(oneDay);
    await contract.feed(0);
    await increaseTime(oneDay);
    await contract.feed(0);
    await increaseTime(oneDay);
    await contract.feed(0);
    sheep = await contract.allSheep(0);
    expect(sheep.level).to.equal(3);
  });

  it("Sheep should die if it has not been feeded in 3 days", async () => {
    const threeDays = 3 * 24 * 60 * 60;

    await contract.mint("mySheep", sheepColors[0], { value: sheepCost });

    await increaseTime(threeDays);
    await expect(contract.feed(0)).to.revertedWith("Your sheep is dead :(");
  });

  it("Should not be possible to feed that you dont own", async () => {
    const [_accountA, accountB] = await ethers.getSigners();

    await contract.mint("mySheep", sheepColors[0], { value: sheepCost });

    const oneDay = 1 * 24 * 60 * 60;
    await increaseTime(oneDay);

    await expect(
      contract.connect(accountB).feed(0)
    ).to.be.revertedWithoutReason();
  });

  it("getOwnedSheep should return correct sheep Ids", async () => {
    const [_accountA, accountB] = await ethers.getSigners();

    await contract.mint("sheep", sheepColors[0], { value: sheepCost });
    await contract.mint("sheep2", sheepColors[0], { value: sheepCost });
    await contract
      .connect(accountB)
      .mint("sheep3", sheepColors[0], { value: sheepCost });

    const sheepsA = await contract.getOwnedSheep();
    const sheepsB = await contract.connect(accountB).getOwnedSheep();

    expect(sheepsA.length).to.equal(2);
    expect(sheepsA[0]).to.equal("0");
    expect(sheepsA[1]).to.equal("1");

    expect(sheepsB.length).to.equal(1);
    expect(sheepsB[0]).to.equal("2");
  });

  it("getSheep should return correct data", async () => {
    const [accountA, accountB] = await ethers.getSigners();

    const txOne = await (
      await contract.mint("sheep", sheepColors[1], {
        value: sheepCost,
      })
    ).wait();

    const txTwo = await (
      await contract.connect(accountB).mint("sheep2", sheepColors[2], {
        value: sheepCost,
      })
    ).wait();

    const blockOne = await ethers.provider.getBlock(txOne.blockNumber);
    const blockTwo = await ethers.provider.getBlock(txTwo.blockNumber);

    const sheepOne = await contract.getSheep(0);
    expect(sheepOne.owner).to.equal(accountA.address);
    expect(sheepOne.id).to.equal(0);
    expect(sheepOne.name).to.equal("sheep");
    expect(sheepOne.color).to.equal(sheepColors[1]);
    expect(sheepOne.level).to.equal(1);
    expect(sheepOne.lastFeedTime.toNumber()).to.equal(blockOne.timestamp);
    expect(sheepOne.timesFed).to.equal(0);
    expect(sheepOne.isAlive).to.equal(true);

    const sheepTwo = await contract.getSheep(1);
    expect(sheepTwo.owner).to.equal(accountB.address);
    expect(sheepTwo.id).to.equal(1);
    expect(sheepTwo.name).to.equal("sheep2");
    expect(sheepTwo.color).to.equal(sheepColors[2]);
    expect(sheepTwo.level).to.equal(1);
    expect(sheepTwo.lastFeedTime.toNumber()).to.equal(blockTwo.timestamp);
    expect(sheepTwo.timesFed).to.equal(0);
    expect(sheepTwo.isAlive).to.equal(true);
  });

  it("Contract owner should be set to contract deployer", async () => {
    const [accountA] = await ethers.getSigners();

    const owner = await contract.owner();
    expect(owner).to.equal(accountA.address);
  });

  it("Only owner should be able to change contract ownership", async () => {
    const [accountA, accountB, accountC] = await ethers.getSigners();

    await expect(
      contract.connect(accountB).transferOwnership(accountC.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await contract.connect(accountA).transferOwnership(accountB.address);
    const owner = await contract.owner();
    expect(owner).to.equal(accountB.address);
  });
});

const increaseTime = async (seconds: number) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
};
