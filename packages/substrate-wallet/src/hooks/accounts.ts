import { Wallet } from '@talismn/connect-wallets'
import { useCallback, useContext, useMemo, useState } from 'react'
import { SubstrateWallet } from '../context'

export function useAccounts() {
	const [loading, setLoading] = useState('')
	const { state, dispatch } = useContext(SubstrateWallet)
	const address = useMemo(() => state.address, [state])

	const connect = useCallback(
		async (connector: Wallet) => {
			setLoading(connector.title)
			console.log('ctest')
			await connector.enable(state.dappName)
			const accounts = await connector.getAccounts()
			if (!dispatch) return
			if (!accounts[0]) return
			dispatch({
				type: 'connect',
				payload: { account: accounts[0], wallet: connector },
			})
			setLoading('')
		},
		[setLoading, dispatch],
	)

	const disconnect = useCallback(() => {
		if (!dispatch) return
		dispatch({
			type: 'disconnect',
			payload: '',
		})
	}, [dispatch])

	return { loading, connect, disconnect, address }
}
