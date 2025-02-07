import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

const APP_NAME = "Coinbase Project";
const APP_LOGO_URL = "";
const INFURA_ID = process.env.INFURA_ID;
const INFURA_RPC_URL = `https://mainnet.infura.io/v3/${INFURA_ID}`;
const DEFAULT_CHAIN_ID = 1;

let coinbaseWalletRef = null;

const createCoinbaseWalletSDKInstance = () => {
  if (coinbaseWalletRef) {
    return coinbaseWalletRef;
  }
  coinbaseWalletRef = new CoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    headlessMode: true,
  });
  return coinbaseWalletRef;
};

// Coinbase Wallet Provider
export const getCoinbaseWalletProvider = () => {
  return createCoinbaseWalletSDKInstance().makeWeb3Provider(
    INFURA_RPC_URL,
    DEFAULT_CHAIN_ID
  );
};

// currently we are not using it
export const getQrURL = () => {
  return createCoinbaseWalletSDKInstance().getQrUrl();
};

// coinbase SVG logo
export const coinbaseLogo = () => {
  return createCoinbaseWalletSDKInstance().getCoinbaseWalletLogo("circle", 50);
};
