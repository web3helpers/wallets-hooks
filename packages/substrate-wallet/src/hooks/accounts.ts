import { Wallet } from '@talismn/connect-wallets'
import { useContext, useMemo, useState } from 'react'
import { SubstrateWallet } from '../context'

export function useAccounts() {
	const [loading, setLoading] = useState(false)
	const { state, dispatch } = useContext(SubstrateWallet)

	const address = useMemo(() => state.address, [state])

	async function connect(connector: Wallet) {
		setLoading(true)
		await connector.enable(state.dappName)
		await connector.getAccounts()
		if (!dispatch) return
		dispatch({
			type: 'connect',
			payload: { address: address ?? '', connector },
		})
	}

	function disconnect() {
		if (!dispatch) return
		dispatch({
			type: 'disconnect',
			payload: '',
		})
	}

	return { loading, connect, disconnect, address }
}
