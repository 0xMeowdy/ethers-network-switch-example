import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { ethers } from 'ethers'

const networks = {
	Polygon: {
		chainId: `0x${Number(137).toString(16)}`,
		chainName: 'Polygon Mainnet',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18,
		},
		rpcUrls: ['https://polygon-rpc.com/'],
		blockExplorerUrls: ['https://polygonscan.com/'],
	},
	BSC: {
		chainId: `0x${Number(56).toString(16)}`,
		chainName: 'Binance Smart Chain Mainnet',
		nativeCurrency: {
			name: 'Binance Chain Native Token',
			symbol: 'BNB',
			decimals: 18,
		},
		rpcUrls: [
			'https://bsc-dataseed1.binance.org',
			'https://bsc-dataseed2.binance.org',
			'https://bsc-dataseed3.binance.org',
			'https://bsc-dataseed4.binance.org',
			'https://bsc-dataseed1.defibit.io',
			'https://bsc-dataseed2.defibit.io',
			'https://bsc-dataseed3.defibit.io',
			'https://bsc-dataseed4.defibit.io',
			'https://bsc-dataseed1.ninicoin.io',
			'https://bsc-dataseed2.ninicoin.io',
			'https://bsc-dataseed3.ninicoin.io',
			'https://bsc-dataseed4.ninicoin.io',
			'wss://bsc-ws-node.nariox.org',
		],
		blockExplorerUrls: ['https://bscscan.com'],
	},
}

export default function App() {
	let [isOpen, setIsOpen] = useState(false)
	let [displayAccount, setDisplayAccount] = useState('')
	let [selectedNetwork, setSelectedNetwork] = useState('')
	let [enableNetworkUI, setEnableNetworkUI] = useState(false)

	function closeModal() {
		setIsOpen(false)
	}

	function openModal() {
		setIsOpen(true)
	}

	const connectWallet = async () => {
		console.log('connectWallet')
		const { ethereum } = window

		if (!ethereum) {
			console.log('No wallet found')
			return
		}
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			await provider.send('eth_requestAccounts', [])
			const signer = provider.getSigner()
			minifyDisplayAccount(await signer.getAddress())
			setSelectedNetwork(
				convertSelectedNetwork(await window.ethereum.networkVersion)
			)
			setEnableNetworkUI(true)
		} catch (error) {
			console.error(error)
		}
	}

	const convertSelectedNetwork = network => {
		if (network === '137') {
			return 'Polygon'
		} else if (network === '56') {
			return 'BSC'
		} else {
			return 'Ethereum'
		}
	}

	const minifyDisplayAccount = address => {
		let beginning = address.slice(0, 6)
		let end = address.slice(address.length - 4, address.length)
		setDisplayAccount(beginning + '...' + end)
	}

	const switchNetwork = async network => {
		const { ethereum } = window
		if (!ethereum) {
			console.log('No wallet found')
			return
		}

		if (network === 'Ethereum') {
			// Ethereum
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x1' }],
				})
				setSelectedNetwork(network)
				closeModal()
			} catch (error) {
				console.error(error)
			}
		} else {
			// Polygon or BSC
			try {
				await window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							...networks[network],
						},
					],
				})
				setSelectedNetwork(network)
				closeModal()
			} catch (error) {
				console.error(error)
			}
		}
	}

	return (
		<>
			<div className='justify-end flex space-x-1 py-4 px-4'>
				<button
					type='button'
					onClick={connectWallet}
					className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md  hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
				>
					{displayAccount ? displayAccount : 'Connect Wallet'}
				</button>
				{enableNetworkUI ? (
					<button
						type='button'
						onClick={openModal}
						className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md  hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
					>
						{selectedNetwork ? selectedNetwork : 'Select Network'}
					</button>
				) : (
					<button
						type='button'
						disabled
						className='opacity-70 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
					>
						Select a Network
					</button>
				)}
			</div>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as='div'
					className='fixed inset-0 z-10 overflow-y-auto'
					onClose={closeModal}
				>
					<div className='min-h-screen px-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<Dialog.Overlay className='fixed inset-0' />
						</Transition.Child>

						{/* This element is to trick the browser into centering the modal contents. */}
						<span
							className='inline-block h-screen align-middle'
							aria-hidden='true'
						>
							&#8203;
						</span>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<div className='inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-500 shadow-xl rounded-2xl'>
								<Dialog.Title
									as='h3'
									className='text-lg font-medium leading-6 text-white'
								>
									Select a Network
								</Dialog.Title>

								<div className='mt-8 justify-start flex space-x-1'>
									<button
										type='button'
										onClick={() => {
											switchNetwork('Ethereum')
										}}
										className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md  hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
									>
										Ethereum
									</button>
									<button
										type='button'
										onClick={() => {
											switchNetwork('Polygon')
										}}
										className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md  hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
									>
										Polygon
									</button>
									<button
										type='button'
										onClick={() => {
											switchNetwork('BSC')
										}}
										className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md  hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75'
									>
										BSC
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}
