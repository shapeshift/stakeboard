import { DashboardData, CoinStats, ValidatorDetails } from "@/lib/staking";
import { StakerData } from "@/lib/tx/service";
import {
  Stat,
  StatLabel,
  StatNumber,
  Stack,
  Box,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { StakerChart, StakingChart } from "components/Chart/StakingChart";


interface IValidatorStats {
  validatorDetails: ValidatorDetails,
  coinStats: CoinStats
}

const displayPercent = (percent) => `${(percent * 100).toFixed(2)}%`;


const ValidatorStats = ({validatorDetails, coinStats}: IValidatorStats) => {
  return (
    <Box p={10}>
      <SimpleGrid columns={{ base: 4 }} spacing={10}>
        <Stat>
          <StatLabel>Validator Rank</StatLabel>
          <StatNumber>{validatorDetails.rank}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>{coinStats.coin} Price</StatLabel>
          <StatNumber>${coinStats.coinUsdPrice}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Staking APR</StatLabel>
          <StatNumber>{displayPercent(validatorDetails.apr)}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Commissions</StatLabel>
          <StatNumber>{displayPercent(validatorDetails.commission)}</StatNumber>
        </Stat>
      </SimpleGrid>
      <TableContainer mt={10}>
        <Table variant="unstyled">
          <Tbody>
            <Tr>
              <Td p="0">Voting Power</Td>
              <Td>{displayPercent(validatorDetails.votingPower)}</Td>
            </Tr>
            <Tr>
              <Td p="0">Operator Address</Td>
              <Td>{validatorDetails.validatorAddress}</Td>
            </Tr>
            <Tr>
              <Td p="0">Address</Td>
              <Td>{validatorDetails.accountAddress}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

interface IDelegatedStats{
  coinStats: CoinStats 
}

const DelegatedStats = ({coinStats}: IDelegatedStats) => {
  return (
    <Box>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column" }}
      >
        <Heading size="md">ATOM Delegated</Heading>
        <Stack>
          <Stat>
            <StatLabel>Total</StatLabel>
            {/* <StatNumber>{coinStats.totalStaked.toFixed(2)} {coinStats.coin}</StatNumber> */}
          </Stat>
          <Stat>
            <StatLabel>Shapeshift</StatLabel>
            <StatNumber>5.23 ATOM</StatNumber>
          </Stat>
        </Stack>
        <StakingChart />
        {/* <PieChart width={300} height={300} /> */}
      </Stack>
    </Box>
  );
};

export interface IStakersStats{
  stakerData: StakerData
}

const StakersStats = ({stakerData}: IStakersStats) => {
  return (
    <Box>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column" }}
      >
        <Heading size="md">Unique stakers</Heading>
        <Stack>
          <Stat>
            <StatLabel>Total</StatLabel>
            <StatNumber>{stakerData.totalStakers}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Shapeshift</StatLabel>
            <StatNumber>{stakerData.shapeshiftStakers}</StatNumber>
          </Stat>
        </Stack>
        <StakerChart stakerData={stakerData} />
        {/* <PieChart width={300} height={300} /> */}
      </Stack>
    </Box>
  );
};

interface IDashboardStats{
  dashboardData: DashboardData
}

const DashboardStats = ({dashboardData}: IDashboardStats) => (
  <Box>
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      // py={{ base: 20, md: 28 }}
      direction={{ base: "column", xl: "row" }}
    >
      <ValidatorStats coinStats={dashboardData.coinStats} validatorDetails={dashboardData.validatorDetails} />
      <DelegatedStats coinStats={dashboardData.coinStats} />
      <StakersStats stakerData={dashboardData.stakerData} />
    </Stack>
  </Box>
);

export default DashboardStats;
