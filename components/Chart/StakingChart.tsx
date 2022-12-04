import { getStakerData, getStakingData, StakerData, StakingData } from "components/Data/mock";
import PieChart from "./PieChart";
import { scaleOrdinal } from "@visx/scale";
import { colors } from "src/theme/colors";
import { IStakersStats } from "../Layout/DashboardStats";

export const StakingChart = () => {
  const data = getStakingData();

  // accessor functions
  const valueAccessor = (d: StakingData) => d.usage;
  const labelAccessor = (d: StakingData) => d.label;

  // color scales
  const colorMapping = scaleOrdinal({
    domain: ["Shapeshift", "Others"],
    range: [colors.blue[400], colors.blue[300]],
  });

  return (
    <PieChart<StakingData>
      width={200}
      height={200}
      data={data}
      colorMapping={colorMapping}
      valueAccessor={valueAccessor}
      labelAccessor={labelAccessor}
    />
  );
};


export const StakerChart = ({stakerData}: IStakersStats) => {
  
    // accessor functions
    const valueAccessor = (d: StakerData) => d.usage;
    const labelAccessor = (d: StakerData) => d.label;
  
    // color scales
    const colorMapping = scaleOrdinal({
      domain: ["Shapeshift", "Others"],
      range: [colors.blue[400], colors.blue[300]],
    });

    const data = 
      [
        {
          label: "Shapeshift",
          usage: stakerData.shapeshiftStakers/stakerData.totalStakers
        },
        {
          label: "Others",
          usage: 1-(stakerData.shapeshiftStakers/stakerData.totalStakers)
        }
      ]
  
    return (
      <PieChart<StakerData>
        width={200}
        height={200}
        data={data}
        colorMapping={colorMapping}
        valueAccessor={valueAccessor}
        labelAccessor={labelAccessor}
      />
    );
  };
  

  
// export const getStakingData = (): StakingData[] => {
//   return [
//     {
//       label: "Shapeshift",
//       usage: 0.3,
//     },
//     {
//       label: "Others",
//       usage: 0.7,
//     },
//   ];
// };