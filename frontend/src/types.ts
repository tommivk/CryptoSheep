export type Sheep = {
  id: string;
  name: string;
  level: string;
  lastFeedTime: string;
  concecutiveFeedingDays: string;
  isAlive: boolean;
  svg: string;
};

export type BlockData = {
  blockNumber: number;
  blockTime: number;
};

export type ContractState = {
  sheepCost: number;
  sheepColors: Array<string>;
  feedingDeadline: number;
  feedingLockDuration: number;
};

export type NotificationMessage = {
  message: string;
  type: "success" | "error";
};
