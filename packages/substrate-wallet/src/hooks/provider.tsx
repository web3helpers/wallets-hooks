import {
  SubscriptionFn,
  Wallet,
  WalletAccount,
} from "@talismn/connect-wallets";
import {
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useEffect,
  useReducer,
} from "react";

interface WalletConfigProps {
  children: ReactNode;
  config: {
    dappName: string;
  };
}

interface WalletState {
  address?: string;
  wallet?: Wallet;
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
      return { ...state, address, subscribe, wallet: connector };
    }
    case "updateAddress":
      return { ...state, address: action.payload as string };
    case "disconnect":
      return { dappName: state.dappName };
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
    const subsribe = state.subscribe;
    if (!state.subscribe) return;
    const unsubscribe = subsribe((accounts: WalletAccount[]) => {
      const address = accounts?.[0].address;
      dispatch({ type: "updateAddress", payload: address });
    });
    return unsubscribe as any;
  }, [state]);
  return (
    <SubstrateWallet.Provider value={value}>
      {children}
    </SubstrateWallet.Provider>
  );
}

export { WalletConfig };
