import { WalletAccount, getWallets, Wallet } from "@talismn/connect-wallets";
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
  config: {
    dappName: string;
  };
}

interface WalletState {
  address?: string;
  dappName: string;
  account?: WalletAccount;
  wallet?: Wallet;
}

interface WalletAction {
  type: string;
  payload: unknown;
}

export const SubstrateWallet = createContext<{
  state: WalletState;
  dispatch?: Dispatch<WalletAction>;
}>({ state: { dappName: "" } });

function walletReducer(state: WalletState, action: WalletAction) {
  console.log("Wallet Action: ", action);

  switch (action.type) {
    case "connect": {
      const { wallet, account } = action.payload as {
        wallet: Wallet;
        account: WalletAccount;
      };
      return { ...state, wallet, account, address: account.address };
    }
    case "updateAddress": {
      const { account } = action.payload as {
        account: WalletAccount;
      };

      return { ...state, address: account.address, account };
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

function WalletConfig({ children, config: { dappName } }: WalletConfigProps) {
  const [state, dispatch] = useReducer<Reducer<WalletState, WalletAction>>(
    walletReducer,
    {
      dappName,
    }
  );
  const value = { state, dispatch };

  useEffect(() => {
    const unsubcsribe = state.wallet?.subscribeAccounts(
      (accounts: WalletAccount[] | undefined) => {
        const address = accounts?.[0]?.address;
        if (address && address != state.address)
          dispatch({
            type: "updateAddress",
            payload: {
              address,
              account: accounts[0],
            },
          });
      }
    );
    return () => {
      if (typeof unsubcsribe === "function") unsubcsribe();
    };
  }, [state, dispatch]);

  return (
    <SubstrateWallet.Provider value={value}>
      {children}
    </SubstrateWallet.Provider>
  );
}

function useClient() {
  const { state } = useContext(SubstrateWallet);
  return state;
}

export { WalletConfig, useClient, getWallets };
