import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "theme/theme";

type ProvidersProps = {
  children: React.ReactNode;
};

const AppProviders = ({ children }: ProvidersProps) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};

export default AppProviders;
