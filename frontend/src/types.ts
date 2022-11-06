export type Sheep = {
  id: string;
  name: string;
  owner: string;
  level: string;
  lastFeedTime: string;
  timesFed: string;
  isAlive: boolean;
  svg: string;
  color: string;
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
