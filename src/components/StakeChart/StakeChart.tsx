import { Box, Heading } from "@chakra-ui/react";
import { getHistoryData } from "components/Data/mock";
import { Graph } from "components/Graph/Graph";
import { HistoryTimeframe } from "components/Graph/HistoryTimeFrame";
import { TimeControls } from "components/Graph/TimeControls";
import React, { useState } from "react";

const oneDay = 86400000

const StakeChart = () => {
  const [timeframe, setTimeFrame] = useState(HistoryTimeframe.MONTH);
  const historyData = getHistoryData();

  const filterData = () => {
    const now = Date.now()
    switch(timeframe){
        case HistoryTimeframe.DAY: return historyData.filter(p => p.date > (now-oneDay))
        case HistoryTimeframe.WEEK: return historyData.filter(p => p.date > (now-(oneDay*7)))
        case HistoryTimeframe.MONTH: return historyData.filter(p => p.date > (now-(oneDay*31)))
        case HistoryTimeframe.YEAR: return historyData.filter(p => p.date > (now-(oneDay*365)))
    }
    return historyData
  }

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
    </>
  );
};

export default StakeChart;
