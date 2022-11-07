import { Tx } from "@/lib/types";
import { Box, Heading } from "@chakra-ui/react";
import { getHistoryData } from "components/Data/mock";
import { Graph } from "components/imported/Graph/Graph";
import { HistoryTimeframe } from "components/imported/Graph/HistoryTimeFrame";
import { TimeControls } from "components/imported/Graph/TimeControls";
import _ from "lodash";
import React, { useState } from "react";
import { HistoryData } from "../imported/Graph/PrimaryChart/PrimaryChart";

interface IAppData{
  txData: Tx[]
}

const convertTxIntoTimechartData = (appData: IAppData) => {
  const delegations = appData.txData.filter(tx => tx.memo === "Delegated with ShapeShift")

  var totalValue = 0
  const sortedDelegations = _.sortBy(delegations, x => x.timestamp)

  const stakedData = sortedDelegations.map(x => {
    const tmp = Number(_.first(x.messages).value.amount)
    totalValue = totalValue+tmp
    return {
      price: totalValue,
      date: x.timestamp*1000 // convert to millis
    } as HistoryData
  })
  console.log(stakedData)
  console.log(getHistoryData())
  return stakedData
}

const TimeCharts = (appData: IAppData) => {
    const oneDay = 86400000
    const [timeframe, setTimeFrame] = useState(HistoryTimeframe.MONTH);
    const historyData = convertTxIntoTimechartData(appData);
  
    const filterData = () => {
      const now = Date.now()
      switch(timeframe){
          case HistoryTimeframe.DAY: return historyData.filter(p => p.date > (now-oneDay))
          case HistoryTimeframe.WEEK: return historyData.filter(p => p.date > (now-(oneDay*7)))
          case HistoryTimeframe.MONTH: {
            const tmp = historyData.filter(p => p.date > (now-(oneDay*31)))
            console.log(now-(oneDay*31))
            console.log(historyData[0].date)
            return tmp
          }
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
}

export default TimeCharts