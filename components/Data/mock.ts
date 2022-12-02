import { HistoryData } from "@/lib/staking";
import _ from "lodash";

export interface StakingData {
  label: string;
  usage: number;
}

export interface StakerData {
  label: string;
  usage: number;
}

export const getStakingData = (): StakingData[] => {
  return [
    {
      label: "Shapeshift",
      usage: 0.3,
    },
    {
      label: "Others",
      usage: 0.7,
    },
  ];
};

export const getStakerData = (): StakingData[] => {
  return [
    {
      label: "Shapeshift",
      usage: 0.23,
    },
    {
      label: "Others",
      usage: 0.77,
    },
  ];
};

export const getHistoryData = () => {
    const now = Date.now()
    var array = Array.from(Array(1000).keys(),n=>n+1);
    const historyData: HistoryData[] = array.map(x => {
        return {
            timestamp: now - (x*86400000), // milis in one day
            amount: Math.floor(Math.random() * 100)
        }
    })
    return historyData
}