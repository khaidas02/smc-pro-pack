import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="description" content="SMC Pro Pack — 4 Smart Money Concepts indicators for TradingView. Liquidity Sweeps, Fair Value Gaps, Order Blocks, Market Structure. One-time 35 USDC." />
        <meta name="keywords" content="tradingview, smc, smart money concepts, ict, liquidity sweep, fair value gap, order block, pine script" />
        <meta property="og:title" content="SMC Pro Pack — Institutional-Grade SMC Toolkit" />
        <meta property="og:description" content="4 battle-tested Pine Script v5 indicators. One-time payment, no subs." />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}