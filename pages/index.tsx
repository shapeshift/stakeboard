import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { Container } from "@chakra-ui/react";
import { TX_COLLECTION } from "@/lib/const";
import Redis from "ioredis";
import Header from "@/components/Layout/Header";
import DashboardStats from "@/components/Layout/DashboardStats";
import TimeCharts from "@/components/Layout/TimeCharts";
import { Tx } from "@/lib/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redis = new Redis();
  const allTx: Tx[] = (await redis.lrange(TX_COLLECTION, 0, -1)).map((x) =>
    JSON.parse(x)
  );

  return {
    props: {
      txData: allTx,
    },
  };
};

interface IHomeProps{
  txData: Tx[]
}

const Home: NextPage<IHomeProps> = (props) => {
  return (
    <main>
      <Container maxW={"7xl"}>
        <Header/>
        <DashboardStats/>
        <TimeCharts txData={props.txData}  />
      </Container>
    </main>
  );
};

export default Home;
