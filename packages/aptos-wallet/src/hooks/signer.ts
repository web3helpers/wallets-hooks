import { useContext, useMemo } from 'react'
import { AptosWallet } from '../context'

export interface SignMessagePayload {
	address?: boolean // Should we include the address of the account in the message
	application?: boolean // Should we include the domain of the dapp
	chainId?: boolean // Should we include the current chain id the wallet is connected to
	message: string // The message to be signed and displayed to the user
	nonce: string // A nonce the dapp should generate
}

export interface SignMessageResponse {
	address: string
	application: string
	chainId: number
	fullMessage: string // The message that was generated to sign
	message: string // The message passed in by the user
	nonce: string
	prefix: string // Should always be APTOS
	signature: string // The signed full message
}
export function useSigner() {
	const { state } = useContext(AptosWallet)
	const signRaw = async (message: SignMessagePayload): Promise<string> => {
		const { signature } = await (window as any).aptos.signRaw({
			type: 'payload',
			data: message,
			address: state.address,
		})
		return signature
	}
	return signRaw
}
