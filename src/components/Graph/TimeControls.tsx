import type { ButtonGroupProps } from '@chakra-ui/button'
import { Radio } from 'components/Radio/Radio'
import { HistoryTimeframe } from "components/Graph/HistoryTimeFrame";

type TimeControlsProps = {
  onChange: (arg: HistoryTimeframe) => void
  defaultTime: HistoryTimeframe
  buttonGroupProps?: ButtonGroupProps
}

export const TimeControls = ({ onChange, defaultTime, buttonGroupProps }: TimeControlsProps) => {
  const options = Object.freeze([
    { value: HistoryTimeframe.HOUR, label: '1H' },
    { value: HistoryTimeframe.DAY, label: '24H' },
    { value: HistoryTimeframe.WEEK, label: 'W' },
    { value: HistoryTimeframe.MONTH, label: '1M' },
    { value: HistoryTimeframe.YEAR, label: '1Y' },
    { value: HistoryTimeframe.ALL, label: 'all' },
  ])
  console.log(options)
  return (
    <Radio
      options={options}
      defaultValue={defaultTime}
      onChange={onChange}
      buttonGroupProps={buttonGroupProps}
    />
  )
}
