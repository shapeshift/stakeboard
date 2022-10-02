import { Container } from "@chakra-ui/react";
import DashboardStats from "components/Layout/DashboardStats";
import Header from "components/Layout/Header";
import StakeChart from "components/StakeChart/StakeChart";


function App() {
  return (
    <Container maxW={"7xl"}>
      <Header/>
      <DashboardStats/>
      <StakeChart/>
    </Container>
  );
}

export default App;
