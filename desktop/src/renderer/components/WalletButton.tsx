import { ConnectButton } from '@rainbow-me/rainbowkit';

function WalletButton() {

  return (
    <ConnectButton showBalance={{
      smallScreen: false,
      largeScreen: true,
    }} />
  )
}

export default WalletButton