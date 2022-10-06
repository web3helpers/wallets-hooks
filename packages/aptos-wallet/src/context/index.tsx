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

interface WalletState {
  address?: string;
  client?: AptosClient;
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
      const { address, client } = action.payload as {
        address: string;
        client: AptosClient
      };
      return { ...state, address, client };
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

