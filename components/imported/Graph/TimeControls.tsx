import type { ButtonGroupProps } from "@chakra-ui/button";
import { Radio } from "components/imported/Radio/Radio";
import { HistoryTimeframe } from "components/imported/Graph/HistoryTimeFrame";
import {
  Box,
  Button,
  Heading,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { CustomTimeFrame } from "@/components/Layout/TimeCharts";

type TimeControlsProps = {
  setTimeFrame: (arg: HistoryTimeframe) => void;
  setCustomTimeFrame: (customTimeFrame: CustomTimeFrame) => void;
  customTimeFrame: CustomTimeFrame,
  defaultTime: HistoryTimeframe;
};

export const TimeControls = ({
  setTimeFrame,
  customTimeFrame,
  setCustomTimeFrame,
  defaultTime,
}: TimeControlsProps) => {

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    console.log("Dates: " + selectedDates)
    if(selectedDates.length == 2){
      // console.log("Setting custom time frame to " + customTimeFrame)
      setCustomTimeFrame({
        from: selectedDates[0],
        to: selectedDates[1]
      })
    }
  }, [selectedDates])

  useEffect(() => {
    if(customTimeFrame != undefined){
      // console.log("Activating custom time frame with ", customTimeFrame.from, customTimeFrame.to)
      setTimeFrame(HistoryTimeframe.CUSTOM)
    }
  }, [customTimeFrame])

  const options = Object.freeze([
    { value: HistoryTimeframe.DAY, label: "24H" },
    { value: HistoryTimeframe.WEEK, label: "1W" },
    { value: HistoryTimeframe.MONTH, label: "1M" },
    { value: HistoryTimeframe.YEAR, label: "1Y" },
    { value: HistoryTimeframe.ALL, label: "All" },
  ]);
  return (
    <Box>
      <Heading mt="0" size="md">
        Time controls
      </Heading>
      <HStack mt="10" spacing={2}>
        {options.map((opt) => {
          return (
            <Button
              key={opt.value}
              minW="70px"
              onClick={() => setTimeFrame(opt.value)}
            >
              {opt.label}
            </Button>
          );
        })}
        <Popover>
          <PopoverTrigger>
            <Button key="custom" minW="70px">
              Custom
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Date range</PopoverHeader>
            <RangeDatepicker
              selectedDates={selectedDates}
              onDateChange={setSelectedDates}
            />
          </PopoverContent>
        </Popover>
      </HStack>
    </Box>
  );
};
