import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Container,
  Stack,
  Box,
  VStack,
  HStack,
  StackDivider,
  Flex,
  SimpleGrid,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

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

const PieCharts = () => {
  return <Box>sth</Box>;
};

const DashboardStats = () => {
  return (
    <Box>
      <Stack
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column", md: "row" }}
      >
        <Stats />
        <PieCharts />
      </Stack>
    </Box>
  );
};

export default DashboardStats;
