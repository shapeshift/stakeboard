import PieChart from "./PieChart";
import { scaleOrdinal } from "@visx/scale";
import { colors } from "src/theme/colors";
import { IDelegatedStats, IStakersStats } from "../Layout/DashboardStats";

export interface PieChartData {
  label: string;
  usage: number;
}

export const DelegatedChart = ({validatorDetails}: IDelegatedStats) => {
  const data = 
  [
    {
      label: "Shapeshift",
      usage: validatorDetails.shapeshiftDelegated/validatorDetails.totalDelegated
    },
    {
      label: "Others",
      usage: 1-(validatorDetails.shapeshiftDelegated/validatorDetails.totalDelegated)
    }
  ]

  // accessor functions
  const valueAccessor = (d: PieChartData) => d.usage;
  const labelAccessor = (d: PieChartData) => d.label;

  // color scales
  const colorMapping = scaleOrdinal({
    domain: ["Shapeshift", "Others"],
    range: [colors.blue[400], colors.blue[300]],
  });

  return (
    <PieChart<PieChartData>
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
    const valueAccessor = (d: PieChartData) => d.usage;
    const labelAccessor = (d: PieChartData) => d.label;
  
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
      <PieChart<PieChartData>
        width={200}
        height={200}
        data={data}
        colorMapping={colorMapping}
        valueAccessor={valueAccessor}
        labelAccessor={labelAccessor}
      />
    );
  };
