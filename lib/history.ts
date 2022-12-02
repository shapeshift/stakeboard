export interface HistoryData {
  timestamp: number;
  amount: number;
}

export interface CoinStats {
    totalStaked: number;
    coin: string;
}

export interface CoinStakingData {
    historyData: HistoryData[],
    coinStats: CoinStats,
}
