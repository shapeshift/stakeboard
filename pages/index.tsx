import React from "react";
import { GetServerSideProps, NextPage } from "next";
import { Container } from "@chakra-ui/react";
import Header from "@/components/Layout/Header";
import DashboardStats from "@/components/Layout/DashboardStats";
import TimeCharts from "@/components/Layout/TimeCharts";
import { getDashboardData } from "@/lib/data";
import { DashboardData } from "@/lib/staking";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      dashboardData: await getDashboardData(),
    },
  };
};

interface IHomeProps {
  dashboardData: DashboardData;
}

const Home: NextPage<IHomeProps> = (props) => {
  return (
    <>
      <main>
        <Container maxW={"7xl"}>
          <Header />
          <DashboardStats dashboardData={props.dashboardData} />
          <TimeCharts stakerData={props.dashboardData.stakerData} />
        </Container>
      </main>
    </>
  );
};

export default Home;
