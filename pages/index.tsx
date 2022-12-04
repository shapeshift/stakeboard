import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { Container } from "@chakra-ui/react";
import Header from "@/components/Layout/Header";
import DashboardStats from "@/components/Layout/DashboardStats";
import TimeCharts from "@/components/Layout/TimeCharts";
import { getDashboardData } from "@/lib/data";
import { CoinStakingData } from "@/lib/staking";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      coinStakingData: await getDashboardData()
    },
  };
};

interface IHomeProps{
  coinStakingData: CoinStakingData
}

const Home: NextPage<IHomeProps> = (props) => {
  return (
    <main>                                                                          
      <Container maxW={"7xl"}>
        <Header/>
        <DashboardStats stakingData={props.coinStakingData}/>
        <TimeCharts historyData={props.coinStakingData.historyData}  />
      </Container>
    </main>
  );
};

export default Home;
