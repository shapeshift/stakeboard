import { Box, Container } from "@chakra-ui/react";
import { Graph } from "components/Graph/Graph";
import { HistoryData } from "components/Graph/PrimaryChart/PrimaryChart";
import DashboardStats from "components/Layout/DashboardStats";
import GraphLayout from "components/Layout/GraphLayout";
import Header from "components/Layout/Header";


function App() {


  return (
    <Container maxW={"7xl"}>
      <Header/>
      <DashboardStats/>
      <GraphLayout/>
    </Container>
  );
}

export default App;
