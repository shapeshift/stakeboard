import { prisma } from "@/lib/prisma";
import { Container } from "@mui/system";
import type { GetServerSideProps, NextPage } from "next";
import Header from "../components/Header";
import SearchControl from "../components/Search";
import styles from "../styles/Home.module.css";
import { Home } from "@prisma/client";
import HomeList from "@/components/HomeList";


export const getServerSideProps: GetServerSideProps = async () => {
  const allHomes: Home[] = await prisma.home.findMany();

  return {
    props: {
      // fix for next.js date serialization issue
      homes: JSON.parse(JSON.stringify(allHomes)),
    },
  };
};

interface ISearchProps {
  homes: Home[];
}

const Home: NextPage<ISearchProps> = (props) => {
  
  return (
    <main className={styles.main}>
      <Header />
      <Container>
        <SearchControl />
        <HomeList {...props} />
      </Container>
    </main>
  );
};

export default Home;
