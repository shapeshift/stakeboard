import { getStakerData, getStakingData, StakerData, StakingData } from "components/Data/mock";
import PieChart from "./PieChart";
import { scaleOrdinal } from "@visx/scale";
import { colors } from '../../theme/colors'

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


export const StakerChart = () => {
    const data = getStakerData();
  
    // accessor functions
    const valueAccessor = (d: StakerData) => d.usage;
    const labelAccessor = (d: StakerData) => d.label;
  
    // color scales
    const colorMapping = scaleOrdinal({
      domain: ["Shapeshift", "Others"],
      range: [colors.blue[400], colors.blue[300]],
    });
  
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
  