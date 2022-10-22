import { useContext, useMemo } from 'react'
import { AptosWallet, Network } from '../context'

const networks = {
	[Network.Testnet]: 'https://testnet.aptoslabs.com',
	[Network.Devnet]: 'https://fullnode.devnet.aptoslabs.com',
	[Network.Mainnet]: 'https://testnet.aptoslabs.com',
}
export function useNetwork() {
	const { state } = useContext(AptosWallet)
	const network = useMemo(() => state.network, [state])
	const url = useMemo(() => network && networks[network], [network])
	return {
		network,
		url,
	}
}
