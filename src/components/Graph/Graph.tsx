import { Center, Fade, SlideFade } from '@chakra-ui/react'
import { ParentSize } from '@visx/responsive'
import { isEmpty } from 'lodash'
import { useMemo } from 'react'

import { GraphLoading } from './GraphLoading'
import { HistoryData, PrimaryChart } from './PrimaryChart/PrimaryChart'


type GraphProps = {
  data: HistoryData[]
  isLoaded?: boolean
  loading?: boolean
  color: string
}

export const Graph: React.FC<GraphProps> = ({ data, isLoaded, loading, color }) => {
  return useMemo(() => {
    return (
      <ParentSize debounceTime={10}>
        {parent => {
          const primaryChartProps = {
            height: parent.height,
            width: parent.width,
            color,
            margin: {
              top: 16,
              right: 0,
              bottom: 60,
              left: 0,
            },
          }
          return loading || !isLoaded ? (
            <Fade in={loading || !isLoaded}>
              <Center width='full' height={parent.height} overflow='hidden'>
                <GraphLoading />
              </Center>
            </Fade>
          ) : !isEmpty(data) ? (
            <SlideFade in={!loading}>
              <PrimaryChart {...primaryChartProps} data={data} />
            </SlideFade>
          ) : null
        }}
      </ParentSize>
    )
  }, [color, data, isLoaded, loading])
}
