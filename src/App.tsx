import { Container } from "@chakra-ui/react";
import DashboardStats from "components/Layout/DashboardStats";
import Header from "components/Layout/Header";
import TimeCharts from "components/Layout/TimeCharts";
import { useCallback, useEffect, useState } from "react";
import { getFullValidatorHistory } from "services/api";

function App() {

  const [data, setData] = useState({});
  const loadData = useCallback(async () => {
      // const fetchData = getFullValidatorHistory()
      // return fetchData;
      return [];
  }, []);

  useEffect(() => {
    let dataLoaded = true;

    const reloadData = () => {
        if(dataLoaded) {
            loadData().then(response => setData(response));
        }
    }

    reloadData();

    return () => {
        dataLoaded = false;
    }

}, [loadData]);

  return (
    <Container maxW={"7xl"}>
      <Header/>
      <DashboardStats/>
      <TimeCharts/>
    </Container>
  );
}

export default App;

