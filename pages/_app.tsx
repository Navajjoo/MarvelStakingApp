import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Cronos } from "@thirdweb-dev/chains";
import { AppProps } from 'next/app'; // Import AppProps

function MyApp({ Component, pageProps }: AppProps) { // Add types here
  return (
    <ThirdwebProvider activeChain={Cronos} 
      clientId="8ff2b8b5ade501e1f73c7560101c8339" // You can get a client id from dashboard settings
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
