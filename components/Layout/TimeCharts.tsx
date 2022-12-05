import { HistoryData } from "@/lib/staking";
import { StakerData } from "@/lib/tx/service";
import { Box, Heading } from "@chakra-ui/react";
import { Graph } from "components/imported/Graph/Graph";
import { HistoryTimeframe } from "components/imported/Graph/HistoryTimeFrame";
import { TimeControls } from "components/imported/Graph/TimeControls";
import _ from "lodash";
import React, { useState } from "react";
interface TimeChartProps {
  stakerData: StakerData;
}

export interface CustomTimeFrame{
  from: Date,
  to: Date
}

const oneDay = 86400000;

const filterData = (data, timeframe, customTimeFrame: CustomTimeFrame) => {
  const now = Date.now();
  switch (timeframe) {
    case HistoryTimeframe.DAY:
      return data.filter((p) => p.timestamp > now - oneDay);
    case HistoryTimeframe.WEEK:
      return data.filter((p) => p.timestamp > now - oneDay * 7);
    case HistoryTimeframe.MONTH: {
      return data.filter((p) => p.timestamp > now - oneDay * 31);;
    }
    case HistoryTimeframe.YEAR:
      return data.filter((p) => p.timestamp > now - oneDay * 365);
    case HistoryTimeframe.CUSTOM:
      return data.filter((p) => p.timestamp >= customTimeFrame.from.getTime() && p.timestamp <= customTimeFrame.to.getTime());
  }
  return data;
};

const TimeCharts = ({ stakerData }: TimeChartProps) => {
  
  const [timeframe, setTimeFrame] = useState(HistoryTimeframe.MONTH);
  const [customTimeFrame, setCustomTimeFrame] = useState(null);

  const delegationsOverTime = stakerData.delegationsOverTime
  const stakersOverTime = stakerData.stakersOverTime

  return (
    <>
      <TimeControls
        setTimeFrame={setTimeFrame}
        customTimeFrame={customTimeFrame}
        setCustomTimeFrame={setCustomTimeFrame}
        defaultTime={HistoryTimeframe.MONTH}
      />
      <Heading mt="10" size="md">
        Total ATOM staked over time
      </Heading>
      <Box height={"350px"}>
        <Graph
          color={"red.500"}
          data={filterData(delegationsOverTime, timeframe, customTimeFrame)}
          loading={false}
          isLoaded={true}
        />
      </Box>
      <Heading mt="10" size="md">
        Unique stakers over time
      </Heading>
      <Box height={"350px"}>
        <Graph
          color={"red.500"}
          data={filterData(stakersOverTime, timeframe, customTimeFrame)}
          loading={false}
          isLoaded={true}
        />
      </Box>
    </>
  );
};

export default TimeCharts;
