import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { Container } from "@chakra-ui/react";
import Header from "@/components/Layout/Header";
import DashboardStats from "@/components/Layout/DashboardStats";
import TimeCharts from "@/components/Layout/TimeCharts";
import { getCoinStakingData } from "@/lib/data";
import { CoinStakingData } from "@/lib/history";
import { ValidatorResponse } from "@/lib/types";
import { getValidatorRank } from "@/lib/validator";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      coinStakingData: await getCoinStakingData(),
      validators: await getValidatorRank()
    },
  };
};

interface IHomeProps{
  coinStakingData: CoinStakingData,
  validators: ValidatorResponse
}

const Home: NextPage<IHomeProps> = (props) => {
  return (
    <main>                                                                          
      <Container maxW={"7xl"}>
        <Header/>
        <DashboardStats coinStats={props.coinStakingData.coinStats}/>
        <TimeCharts historyData={props.coinStakingData.historyData}  />
      </Container>
    </main>
  );
};

export default Home;
