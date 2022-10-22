import { useCallback, useContext, useMemo, useState } from 'react'
import { AptosWallet } from '../context'

export function useAccounts() {
	const [loading, setLoading] = useState('')
	const { state, dispatch } = useContext(AptosWallet)
	const address = useMemo(() => state.address, [state])

	const connect = useCallback(async () => {
		setLoading('Petra')
		let wallet
		if ('aptos' in window) {
			wallet = (window as any).aptos
		} else {
			setLoading('')
			window.open('https://petra.app/', `_blank`)
			return
		}
		try {
			await wallet.connect()
			const network = await wallet.network()
			const { address } = await wallet.account()
			if (!dispatch) return
			if (!address) return
			dispatch({
				type: 'connect',
				payload: { address, network, wallet },
			})
		} catch (error) {
			console.log(error)
		} finally {
			setLoading('')
		}
	}, [setLoading, dispatch])

	const disconnect = useCallback(async () => {
		if (!dispatch) return
		await state.wallet.disconnect()
		dispatch({
			type: 'disconnect',
			payload: '',
		})
	}, [dispatch])

	return { loading, connect, disconnect, address }
}
