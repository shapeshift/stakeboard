import { Container } from "@chakra-ui/react";
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
