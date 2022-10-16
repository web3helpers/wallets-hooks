import logo from './petra-logo.svg'

const supportsWallets = [
	{
		extensionName: 'petra',
		title: 'Petra',
		installUrl: 'https://petra.app/',
		noExtensionMessage: 'You can use any Aptos compatible wallet but we recommend using Petra',
		logo: {
			src: logo,
			alt: 'Petra Logo',
		},
	},
]

export function getWallets() {
	return supportsWallets
}
