import { useContext, useMemo } from 'react'
import { SubstrateWallet } from '../context'

export function useSigner() {
	const { state } = useContext(SubstrateWallet)
	const signer = useMemo(() => state.wallet?.signer, [state])
	const signRaw = async (message: string): Promise<string> => {
		const { signature } = await signer.signRaw({
			type: 'payload',
			data: message,
			address: state.address,
		})
		return signature
	}
	return signRaw
}
