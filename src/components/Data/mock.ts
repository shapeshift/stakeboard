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
