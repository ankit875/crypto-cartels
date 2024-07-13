import RouteConfig from './RouteConfiguration'
import './App.css'
// import { createWeb3Modal } from '@web3modal/wagmi/react'
// import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
// import { arbitrum, mainnet, sepolia } from 'wagmi/chains'
import { config } from './config'
import { WalletOptions } from './components/WalletOptions'
import { ConnectWallet } from './components/ConnectWallet'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 0. Setup queryClient
// const queryClient = new QueryClient()

// // 1. Get projectId
// const projectId = '0ac898f55540be7904ac57263e10bb70'

// // 2. Create wagmiConfig
// const metadata = {
//   name: 'crypto-cartels',
//   description: 'Web3Modal Example',
//   url: 'https://web3modal.com', // origin must match your domain & subdomain
//   icons: ['https://avatars.githubusercontent.com/u/37784886'],
// }

const queryClient = new QueryClient()

// const chains = [mainnet, arbitrum, sepolia] as const
// const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
// })

// // 3. Create modal
// createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true, // Optional - defaults to your Cloud configuration
//   enableOnramp: true, // Optional - false as default
// })

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <div id="toast" />
      <div className="wallet-btn">
        {/* <w3m-button /> */}
        <ConnectWallet />
      </div>

      <RouteConfig />
    </QueryClientProvider>
  </WagmiProvider>
)

export default App
