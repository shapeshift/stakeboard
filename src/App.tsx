import { Container } from "@chakra-ui/react";
import DashboardStats from "components/Layout/DashboardStats";
import Header from "components/Layout/Header";
import TimeCharts from "components/Layout/TimeCharts";


function App() {
  return (
    <Container maxW={"7xl"}>
      <Header/>
      <DashboardStats/>
      <TimeCharts/>
    </Container>
  );
}

export default App;
