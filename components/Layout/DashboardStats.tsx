import { CoinStats } from "@/lib/history";
import { CoinStakingData, ValidatorDetails } from "@/lib/staking";
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
  validatorDetails: ValidatorDetails
}

const displayPercent = (percent) => `${(percent * 100).toFixed(2)}%`;


const ValidatorStats = ({validatorDetails}: IValidatorStats) => {
  return (
    <Box p={10}>
      <SimpleGrid columns={{ base: 4 }} spacing={10}>
        <Stat>
          <StatLabel>Validator Rank</StatLabel>
          <StatNumber>{validatorDetails.rank}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>ATOM Price</StatLabel>
          <StatNumber>$14.07</StatNumber>
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
            <StatNumber>{coinStats.totalStaked.toFixed(2)} {coinStats.coin}</StatNumber>
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


const StakersStats = () => {
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
            <StatNumber>30</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Shapeshift</StatLabel>
            <StatNumber>3</StatNumber>
          </Stat>
        </Stack>
        <StakerChart />
        {/* <PieChart width={300} height={300} /> */}
      </Stack>
    </Box>
  );
};

interface IDashboardStats{
  stakingData: CoinStakingData
}

const DashboardStats = ({stakingData}: IDashboardStats) => (
  <Box>
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      // py={{ base: 20, md: 28 }}
      direction={{ base: "column", xl: "row" }}
    >
      <ValidatorStats validatorDetails={stakingData.validatorDetails} />
      <DelegatedStats coinStats={stakingData.coinStats} />
      <StakersStats  />
    </Stack>
  </Box>
);

export default DashboardStats;
