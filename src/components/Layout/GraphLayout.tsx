import { Box, Button, Heading } from "@chakra-ui/react";
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
    {
      price: 80,
      date: 1661608836720,
    },
    {
      price: 200,
      date: 1661608826720,
    },
  ];

  return (
    <>
      <TimeControls onChange={() => {}} defaultTime={HistoryTimeframe.MONTH} />
      <Heading mt="10" size="md">Delegations over time</Heading>
      <Box height={"350px"}>
        <Graph color={"red.500"} data={data} loading={false} isLoaded={true} />
      </Box>
    </>
  );
};

export default GraphLayout;
