// ============================================================
//  SMC PRO PACK — Constants & Configuration
// ============================================================

// USDC contract address (Ethereum mainnet)
export const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

// Payout wallet
export const PAYOUT_ADDRESS = '0x34d647d24a296916bee1253fc03dc2b242eaad6f'

// Price: 35 USDC (USDC has 6 decimals)
export const PRICE_USDC = 35n
export const PRICE_WEI = PRICE_USDC * 1_000_000n

// Chain ID for Ethereum mainnet
export const CHAIN_ID = 1

// USDC ERC20 ABI (minimal — just transfer + events)
export const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
] as const

// Features list
export const FEATURES = [
  {
    icon: '⚡',
    title: 'Liquidity Sweep Detector',
    desc: 'Automatically identifies buy-side and sell-side liquidity grabs with exact price levels and real-time alerts.',
  },
  {
    icon: '📊',
    title: 'Fair Value Gap Mapper',
    desc: 'Plots imbalance zones between candles with time-based decay — never chase a stale gap again.',
  },
  {
    icon: '🧱',
    title: 'Order Block Identifier',
    desc: 'Flags bullish and bearish order blocks based on the last candle before a strong directional move.',
  },
  {
    icon: '📈',
    title: 'Market Structure Break',
    desc: 'Tracks HH/HL/LH/LL patterns and alerts on confirmed structure breaks with visual lines.',
  },
]

// Why SMC section
export const WHY_SMC = [
  {
    title: 'No Lag',
    desc: 'Real-time detection using pure Pine Script v5 — no repainting, no look-ahead bias.',
  },
  {
    title: 'Battle-Tested',
    desc: 'Built on the same concepts used by institutional SMC/ICT traders. 50M+ TradingView users.',
  },
  {
    title: 'One-Time Payment',
    desc: 'Pay 35 USDC once via crypto wallet. No subscriptions, no renewal fees. Own it forever.',
  },
  {
    title: 'Plug & Play',
    desc: 'Paste into TradingView and go. Full user controls for lookback, sensitivity, and display toggles.',
  },
]