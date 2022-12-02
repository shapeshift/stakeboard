export interface CoinStakingData {
  historyData: HistoryData[],
  coinStats: CoinStats,
  validatorDetails: ValidatorDetails
}

export interface HistoryData {
  timestamp: number;
  amount: number;
}

export interface CoinStats {
    totalStaked: number;
    coin: string;
}

export interface ValidatorDetails {
  apr: number;
  validatorAddress: string;
  accountAddress: string;
  rank: number;
  commission: number;
  votingPower: number;
}
