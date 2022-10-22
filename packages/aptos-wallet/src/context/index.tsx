import { AptosClient, Types } from "aptos";

import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from "react";

interface WalletConfigProps {
  children?: ReactNode;
}

export enum Network {
  Testnet = "Testnet",
  Mainnet = "Mainnet",
  Devnet = "Devnet",
}
interface WalletState {
  wallet?: any;
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
      const { address, network, wallet } = action.payload as {
        address: string;
        network: Network;
        wallet: any;
      };
      return { ...state, address, network, wallet };
    }
    case "updateNetwork": {
      const { network } = action.payload as {
        network: Network;
      };
      return { ...state, network };
    }
    case "updateAddress": {
      const { address } = action.payload as {
        address: string;
      };
      return { ...state, address };
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

  useEffect(() => {
    if (!state.wallet) return;
    state.wallet.onNetworkChange((network: Network | undefined) => {
      dispatch({
        type: "updateNetwork",
        payload: {
          network,
        },
      });
    });
    state.wallet.onAccountChange(
      (newAccount: { address: string | undefined }) => {
        // If the new account has already connected to your app then the newAccount will be returned
        if (newAccount) {
          dispatch({
            type: "updateAddress",
            payload: {
              address: newAccount.address,
            },
          });
        } else {
          // Otherwise you will need to ask to connect to the new account
          const { address } = (window as any).aptos.connect();
          dispatch({
            type: "updateAddress",
            payload: {
              address,
            },
          });
        }
      }
    );
  }, [state, dispatch]);

  return <AptosWallet.Provider value={value}>{children}</AptosWallet.Provider>;
}

function useClient() {
  const { state } = useContext(AptosWallet);
  return state;
}

export { useClient, WalletConfig };
