import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState, useEffect, useCallback } from 'react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import {
  PAYOUT_ADDRESS,
  PRICE_WEI,
  PRICE_USDC,
  USDC_ABI,
  USDC_ADDRESS,
  FEATURES,
  WHY_SMC,
} from '../lib/constants'
import { downloadAsset } from '../lib/asset'

type PaymentStatus = 'idle' | 'confirming' | 'verifying' | 'paid' | 'error'

export default function Home() {
  const { address, isConnected, chainId } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handlePurchase = useCallback(async () => {
    if (!address || !walletClient || !publicClient) return
    setStatus('confirming')
    setErrorMsg('')

    try {
      const hash = await walletClient.writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [PAYOUT_ADDRESS, PRICE_WEI],
        chain: chainId as any,
        account: address,
      })

      setTxHash(hash)
      setStatus('verifying')

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'success') {
        const transferLog = receipt.logs.find(
          (log) =>
            log.address.toLowerCase() === USDC_ADDRESS.toLowerCase() &&
            log.topics[2]?.toLowerCase() === `0x000000000000000000000000${PAYOUT_ADDRESS.slice(2).toLowerCase()}`
        )

        if (transferLog) {
          setStatus('paid')
          setTimeout(() => downloadAsset(), 1500)
        } else {
          throw new Error('Transfer verification failed — payout address mismatch')
        }
      } else {
        throw new Error('Transaction reverted on chain')
      }
    } catch (err: any) {
      console.error('Purchase error:', err)
      if (err.code === 4001 || err.message?.includes('rejected')) {
        setErrorMsg('Transaction was rejected in your wallet')
      } else {
        setErrorMsg(err.message || 'Transaction failed')
      }
      setStatus('error')
    }
  }, [address, walletClient, publicClient, chainId])

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  return (
    <div className="min-h-screen">
      {/* ===== NAV ===== */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <span className="nav-title">SMC Pro Pack</span>
            <span className="nav-badge">v1.0</span>
          </div>
          {mounted && (
            <div className="scale-90">
              <ConnectButton showBalance={false} />
            </div>
          )}
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="hero-badge">
            <span className="hero-dot animate-pulse-glow" />
            Live on TradingView — 4 Smart Money Indicators
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Institutional-Grade{' '}
            <span className="gradient-text">SMC Toolkit</span>
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto mb-10">
            Liquidity Sweeps · Fair Value Gaps · Order Blocks · Market Structure Breaks
            — four battle-tested Pine Script v5 indicators in one pack. One-time payment, no subs.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="price-text">35 USDC</div>
            <p className="text-sm text-muted">One-time · Forever license</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section className="py-20 px-6 section-alt">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">What You Get</h2>
          <p className="text-secondary text-center mb-12 max-w-xl mx-auto">
            Four meticulously crafted Pine Script v5 indicators, designed for serious traders.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card p-6 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="card-feature-icon">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY SMC ===== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why This Pack?</h2>
          <p className="text-secondary text-center mb-12 max-w-xl mx-auto">
            Built with the same Smart Money Concepts used by institutional traders.
          </p>
          <div className="grid lg:grid-cols-4 gap-4">
            {WHY_SMC.map((w, i) => (
              <div
                key={i}
                className="gradient-border p-6 animate-fade-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <h3 className="font-semibold mb-2">{w.title}</h3>
                <p className="text-sm text-secondary leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PURCHASE SECTION ===== */}
      <section className="py-20 px-6 section-alt" id="purchase">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Get Instant Access</h2>
          <p className="text-secondary mb-8">
            Connect your wallet, send 35 USDC on Ethereum, and the code downloads automatically.
          </p>

          <div className="purchase-card glow-purple">
            {!mounted ? (
              <div className="h-12" style={{ background: '#2d2d50', borderRadius: '0.5rem', animation: 'pulse-glow 1.5s infinite' }} />
            ) : status === 'paid' ? (
              <div className="animate-fade-in">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3 className="text-xl font-bold text-teal mb-2">Payment Confirmed!</h3>
                <p className="text-secondary text-sm mb-4">
                  Your SMC Pro Pack is downloading now.
                </p>
                <button
                  onClick={downloadAsset}
                  className="btn-secondary"
                >
                  ⬇ Download Again
                </button>
                {txHash && (
                  <a
                    href={`https://etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 text-xs text-muted transition-colors"
                  >
                    View Transaction ↗
                  </a>
                )}
              </div>
            ) : !isConnected ? (
              <div>
                <p className="text-secondary mb-6">Connect your wallet to purchase</p>
                <ConnectButton />
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <p className="text-sm text-muted mb-1">Connected as</p>
                  <p className="font-mono text-sm">{shortAddr}</p>
                  <p className="text-xs text-muted mt-1">
                    Network: {chainId === 1 ? 'Ethereum Mainnet' : `Chain ${chainId}`}
                  </p>
                </div>

                <div className="order-summary">
                  <div className="order-row">
                    <span className="order-label">Item</span>
                    <span>SMC Pro Pack</span>
                  </div>
                  <div className="order-row">
                    <span className="order-label">Price</span>
                    <span className="font-mono">35 USDC</span>
                  </div>
                  <div className="order-row">
                    <span className="order-label">Network</span>
                    <span>Ethereum</span>
                  </div>
                  <hr className="order-divider" />
                  <div className="order-row font-semibold">
                    <span>Total</span>
                    <span className="font-mono order-total">35 USDC</span>
                  </div>
                  <div className="mt-2 text-xs text-muted">
                    Pay to: <span className="font-mono">{PAYOUT_ADDRESS.slice(0, 10)}...{PAYOUT_ADDRESS.slice(-6)}</span>
                  </div>
                </div>

                {status === 'confirming' && (
                  <div className="flex items-center justify-center gap-2 text-teal mb-4">
                    <div className="spinner spinner-teal" />
                    <span className="text-sm">Waiting for wallet confirmation...</span>
                  </div>
                )}

                {status === 'verifying' && (
                  <div className="flex items-center justify-center gap-2 text-purple mb-4">
                    <div className="spinner spinner-purple" />
                    <span className="text-sm">Verifying transaction on-chain...</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="alert-error">{errorMsg}</div>
                )}

                {chainId !== 1 && (
                  <div className="alert-warning">
                    ⚠ Switch to Ethereum Mainnet in your wallet
                  </div>
                )}

                <button
                  onClick={handlePurchase}
                  disabled={status === 'confirming' || status === 'verifying' || chainId !== 1}
                  className="btn-primary"
                >
                  {status === 'confirming' || status === 'verifying'
                    ? 'Processing...'
                    : '🔓 Unlock & Download'}
                </button>

                <p className="text-xs text-muted mt-4">
                  You will be asked to confirm a transfer of 35 USDC to our payout wallet.
                  Files auto-download upon on-chain confirmation.
                </p>
              </div>
            )}
          </div>

          {isConnected && status === 'idle' && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure wallet-to-wallet transaction via USDC ERC-20
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <p style={{ marginBottom: '0.25rem' }}>SMC Pro Pack v1.0 — Built for TradingView Pine Script v5</p>
        <p>
          One-time purchase. No subscriptions. No refunds — digital goods are final.{' '}
          <a href={`https://etherscan.io/address/${PAYOUT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="underline transition-colors">
            Verify payout wallet
          </a>
        </p>
      </footer>
    </div>
  )
}