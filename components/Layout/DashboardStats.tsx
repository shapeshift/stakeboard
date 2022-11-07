import { CoinStats } from "@/lib/history";
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

const Stats = () => {
  return (
    <Box p={10}>
      <SimpleGrid columns={{ base: 4 }} spacing={10}>
        <Stat>
          <StatLabel>Validator Rank</StatLabel>
          <StatNumber>44</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>ATOM Price</StatLabel>
          <StatNumber>$14.07</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Staking APR</StatLabel>
          <StatNumber>17.85%</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Commissions</StatLabel>
          <StatNumber>10%</StatNumber>
        </Stat>
      </SimpleGrid>
      <TableContainer mt={10}>
        <Table variant="unstyled">
          <Tbody>
            <Tr>
              <Td p="0">Voting Power</Td>
              <Td>0.47%</Td>
            </Tr>
            <Tr>
              <Td p="0">Operator Address</Td>
              <Td>cosmosvaloper199mlc7fr6ll5t54w7tts7f4s0cvnqgc59nmuxf﻿</Td>
            </Tr>
            <Tr>
              <Td p="0">Address</Td>
              <Td>cosmos199mlc7fr6ll5t54w7tts7f4s0cvnqgc5q80f26</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const DelegatedStats = ({coinStats}: IDashboardStats) => {
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
  coinStats: CoinStats
}

const DashboardStats = ({coinStats}: IDashboardStats) => (
  <Box>
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      // py={{ base: 20, md: 28 }}
      direction={{ base: "column", xl: "row" }}
    >
      <Stats />
      <DelegatedStats coinStats={coinStats} />
      <StakersStats />
    </Stack>
  </Box>
);

export default DashboardStats;
