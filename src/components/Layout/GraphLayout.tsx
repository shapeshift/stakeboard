import { Box, Button } from "@chakra-ui/react";
import { Graph } from "components/Graph/Graph";
import { HistoryTimeframe } from "components/Graph/HistoryTimeFrame";
import { HistoryData } from "components/Graph/PrimaryChart/PrimaryChart";
import { TimeControls } from "components/Graph/TimeControls";

const GraphLayout = () => {
  const data: HistoryData[] = [
    {
      price: 23,
      date: 1661500818818,
    },
    {
      price: 18,
      date: 1661518874674,
    },
    {
      price: 50,
      date: 1661608836220,
    },
  ];

  return (
    <>
      <TimeControls onChange={() => {}} defaultTime={HistoryTimeframe.MONTH} />

      <Box height={"350px"}>
        <Graph color={"red.500"} data={data} loading={false} isLoaded={true} />
      </Box>
    </>
  );
};

export default GraphLayout;
