import type { ButtonGroupProps } from "@chakra-ui/button";
import { Radio } from "components/imported/Radio/Radio";
import { HistoryTimeframe } from "components/imported/Graph/HistoryTimeFrame";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";

type TimeControlsProps = {
  setTimeFrame: (arg: HistoryTimeframe) => void;
  defaultTime: HistoryTimeframe;
};

export const TimeControls = ({
  setTimeFrame,
  defaultTime,
}: TimeControlsProps) => {
  const options = Object.freeze([
    { value: HistoryTimeframe.DAY, label: "24H" },
    { value: HistoryTimeframe.WEEK, label: "1W" },
    { value: HistoryTimeframe.MONTH, label: "1M" },
    { value: HistoryTimeframe.YEAR, label: "1Y" },
    { value: HistoryTimeframe.ALL, label: "All" },
    { value: HistoryTimeframe.ALL, label: "Custom" },
  ]);
  return (
    <Box>
      <Heading mt="0" size="md">
        Time controls
      </Heading>
      <HStack mt="10" spacing={2}>
        {options.map((opt) => {
          return <Button key={opt.value} minW="70px" onClick={() => setTimeFrame(opt.value)}>{opt.label}</Button>;
        })}
      </HStack>
    </Box>
  );
};
