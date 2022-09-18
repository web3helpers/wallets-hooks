import { SubscriptionFn, Wallet } from "@talismn/connect-wallets";
import { createContext, Dispatch, ReactNode, Reducer, useReducer } from "react";

interface WalletConfigProps {
  children: ReactNode;
  config: {
    dappName: string;
  };
}

interface WalletState {
  address?: string;
  dappName: string;
  connnectedWallet?: string;
  subscribe?: (callback: SubscriptionFn) => unknown;
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
      const { address, connector } = action.payload as {
        connector: Wallet;
        address: string;
      };
      const subscribe = connector.subscribeAccounts;
      return { ...state, address, subscribe };
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
  return (
    <SubstrateWallet.Provider value={value}>
      {children}
    </SubstrateWallet.Provider>
  );
}

export { WalletConfig };
