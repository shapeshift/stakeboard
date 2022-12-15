import { StakerData } from "./tx/service";

export interface DashboardData {
  coinStats: CoinStats,
  stakerData: StakerData,
  validatorDetails: ValidatorDetails
}

export interface CoinStats {
    coin: string;
    coinUsdPrice: number;
}

export interface ValidatorDetails {
  apr: number;
  validatorAddress: string;
  accountAddress: string;
  rank: number;
  commission: number;
  votingPower: number;
  totalDelegated: number;
  shapeshiftDelegated: number;
}

export interface HistoryData {
  timestamp: number;
  amount: number;
}
