import type { ButtonGroupProps } from "@chakra-ui/button";
import { Radio } from "components/Radio/Radio";
import { HistoryTimeframe } from "components/Graph/HistoryTimeFrame";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";

type TimeControlsProps = {
  onChange: (arg: HistoryTimeframe) => void;
  defaultTime: HistoryTimeframe;
  buttonGroupProps?: ButtonGroupProps;
};

export const TimeControls = ({
  onChange,
  defaultTime,
  buttonGroupProps,
}: TimeControlsProps) => {
  const options = Object.freeze([
    { value: HistoryTimeframe.HOUR, label: "1H" },
    { value: HistoryTimeframe.DAY, label: "24H" },
    { value: HistoryTimeframe.WEEK, label: "1W" },
    { value: HistoryTimeframe.MONTH, label: "1M" },
    { value: HistoryTimeframe.YEAR, label: "1Y" },
    { value: HistoryTimeframe.ALL, label: "All" },
    { value: HistoryTimeframe.ALL, label: "Custom" },
  ]);
  return (
    <Box>
      <Heading mt="10" size="md">Time controls</Heading>
      <HStack mt="10" spacing={2}>
      {options.map((opt) => {
        return (
          <Button minW="70px">
            {opt.label}
          </Button>
        );
      })}
      </HStack>
    </Box>
  );
};
