import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import "../styles/style.scss";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default MyApp;
