import { useContext, useMemo } from 'react'
import { SubstrateWallet } from './provider.jsx'

export function useSigner() {
	const { state } = useContext(SubstrateWallet)
	const signer = useMemo(() => state.wallet?.signer, [state])
	return signer
}
