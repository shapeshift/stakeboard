import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { theme } from "../src/theme/theme";
import { ChakraProvider } from "@chakra-ui/react";

// adds timestamp to every console.log
require('log-timestamp');


function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;