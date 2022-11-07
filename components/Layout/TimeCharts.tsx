import { HistoryData } from "@/lib/history";
import { Box, Heading } from "@chakra-ui/react";
import { Graph } from "components/imported/Graph/Graph";
import { HistoryTimeframe } from "components/imported/Graph/HistoryTimeFrame";
import { TimeControls } from "components/imported/Graph/TimeControls";
import _ from "lodash";
import React, { useState } from "react";

interface TimeChartProps {
  historyData: HistoryData[];
}

const TimeCharts = ({ historyData }: TimeChartProps) => {
  const oneDay = 86400000;
  const [timeframe, setTimeFrame] = useState(HistoryTimeframe.MONTH);

  const filterData = () => {
    const now = Date.now();
    switch (timeframe) {
      case HistoryTimeframe.DAY:
        return historyData.filter((p) => p.timestamp > now - oneDay);
      case HistoryTimeframe.WEEK:
        return historyData.filter((p) => p.timestamp > now - oneDay * 7);
      case HistoryTimeframe.MONTH: {
        return historyData.filter((p) => p.timestamp > now - oneDay * 31);;
      }
      case HistoryTimeframe.YEAR:
        return historyData.filter((p) => p.timestamp > now - oneDay * 365);
    }
    return historyData;
  };

  return (
    <>
      <TimeControls
        setTimeFrame={setTimeFrame}
        defaultTime={HistoryTimeframe.MONTH}
      />
      <Heading mt="10" size="md">
        Delegations over time
      </Heading>
      <Box height={"350px"}>
        <Graph
          color={"red.500"}
          data={filterData()}
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
          data={filterData()}
          loading={false}
          isLoaded={true}
        />
      </Box>
    </>
  );
};

export default TimeCharts;
