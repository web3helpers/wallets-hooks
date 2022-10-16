import { Types, AptosClient } from "aptos";

import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useContext,
  useReducer,
} from "react";

interface WalletConfigProps {
  children?: ReactNode;
}

enum Network {
  Testnet = "Testnet",
  Mainnet = "Mainnet",
  Devnet = "Devnet",
}
interface WalletState {
  address?: string;
  client?: AptosClient;
  network?: Network;
}

interface WalletAction {
  type: string;
  payload: unknown;
}

export const AptosWallet = createContext<{
  state: WalletState;
  dispatch?: Dispatch<WalletAction>;
}>({ state: {} });

function walletReducer(state: WalletState, action: WalletAction) {
  console.log("Wallet Action: ", action);

  switch (action.type) {
    case "connect": {
      const { address, network } = action.payload as {
        address: string;
        network: Network;
      };
      return { ...state, address, network };
    }
    case "disconnect": {
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

function WalletConfig({ children }: WalletConfigProps) {
  const [state, dispatch] = useReducer<Reducer<WalletState, WalletAction>>(
    walletReducer,
    {}
  );
  const value = { state, dispatch };

  return <AptosWallet.Provider value={value}>{children}</AptosWallet.Provider>;
}

function useClient() {
  const { state } = useContext(AptosWallet);
  return state;
}

export { WalletConfig, useClient };
