import { AptosClient } from 'aptos'
import { useCallback, useContext, useMemo, useState } from 'react'
import { AptosWallet } from '../context'

export function useAccounts() {
	const [loading, setLoading] = useState('')
	const { state, dispatch } = useContext(AptosWallet)
	const address = useMemo(() => state.address, [state])

	const connect = useCallback(async () => {
		setLoading('Aptos')
		await (window as any).aptos.connect()
		const status = await (window as any).aptos.isConnected()
		if (!status) return
		const address = await (window as any).aptos.account()
		const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1')
		if (!dispatch) return
		if (!address) return
		dispatch({
			type: 'connect',
			payload: { address, client },
		})
		setLoading('')
	}, [setLoading, dispatch])

	const disconnect = useCallback(async () => {
		if (!dispatch) return
		await (window as any).aptos.disconnect()
		dispatch({
			type: 'disconnect',
			payload: '',
		})
	}, [dispatch])

	return { loading, connect, disconnect, address }
}
