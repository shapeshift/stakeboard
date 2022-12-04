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

const TimeCharts = ({ stakerData }: TimeChartProps) => {
  const oneDay = 86400000;
  const [timeframe, setTimeFrame] = useState(HistoryTimeframe.MONTH);

  const delegationsOverTime = stakerData.delegationsOverTime
  const stakersOverTime = stakerData.stakersOverTime

  const filterDelegations = () => {
    const now = Date.now();
    switch (timeframe) {
      case HistoryTimeframe.DAY:
        return delegationsOverTime.filter((p) => p.timestamp > now - oneDay);
      case HistoryTimeframe.WEEK:
        return delegationsOverTime.filter((p) => p.timestamp > now - oneDay * 7);
      case HistoryTimeframe.MONTH: {
        return delegationsOverTime.filter((p) => p.timestamp > now - oneDay * 31);;
      }
      case HistoryTimeframe.YEAR:
        return delegationsOverTime.filter((p) => p.timestamp > now - oneDay * 365);
    }
    return delegationsOverTime;
  };


  const filterStakers = () => {
    const now = Date.now();
    switch (timeframe) {
      case HistoryTimeframe.DAY:
        return stakersOverTime.filter((p) => p.timestamp > now - oneDay);
      case HistoryTimeframe.WEEK:
        return stakersOverTime.filter((p) => p.timestamp > now - oneDay * 7);
      case HistoryTimeframe.MONTH: {
        return stakersOverTime.filter((p) => p.timestamp > now - oneDay * 31);;
      }
      case HistoryTimeframe.YEAR:
        return stakersOverTime.filter((p) => p.timestamp > now - oneDay * 365);
    }
    return stakersOverTime;
  };

  return (
    <>
      <TimeControls
        setTimeFrame={setTimeFrame}
        defaultTime={HistoryTimeframe.MONTH}
      />
      <Heading mt="10" size="md">
        Total ATOM staked over time
      </Heading>
      <Box height={"350px"}>
        <Graph
          color={"red.500"}
          data={filterDelegations()}
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
          data={filterStakers()}
          loading={false}
          isLoaded={true}
        />
      </Box>
    </>
  );
};

export default TimeCharts;
