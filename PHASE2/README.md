# 📈 SMC Pro Pack — 4 Smart Money Concepts Indicators for TradingView

> **The only Pine Script v5 pack you need: Liquidity Sweeps, Fair Value Gaps, Order Blocks & Market Structure Breaks.**
>
> [![Buy Now — 35 USDC](https://img.shields.io/badge/Buy_Now-35_USDC-7c3aed?style=for-the-badge&logo=ethereum&logoColor=white)](https://smc-pro-pack.surge.sh)
> [![Live Demo](https://img.shields.io/badge/Live_Demo-View_Site-00f5d4?style=for-the-badge)](https://smc-pro-pack.surge.sh)
> [![TradingView](https://img.shields.io/badge/TradingView-Pine_Script_v5-2962FF?style=for-the-badge&logo=tradingview&logoColor=white)](https://www.tradingview.com/pine-script-docs/en/v5/)

---

## ⚡ What Is This?

**SMC Pro Pack** is a bundle of 4 institutional-grade Smart Money Concepts indicators written in **Pine Script v5** for TradingView. Designed for ICT, SMC, and price-action traders who want clean, real-time visual cues without the lag or repainting of most free scripts.

**One-time payment of 35 USDC. No subscriptions. No hidden fees. Download immediately after payment.**

---

## 🧩 The 4 Modules

### 1️⃣ ⚡ Liquidity Sweep Detector

Detects when price aggressively grabs buy-side or sell-side liquidity below/above recent swing points, then reverses. This is the single most reliable setup in SMC trading.

**How it works:**
- Scans back `lookback` bars for recent swing lows and swing highs
- Triggers when price dips below a swing low (or spikes above a swing high) and closes back inside the range
- Labels the sweep with ⚡ BUY-SIDE LIQ SWEEP or ⚡ SELL-SIDE LIQ SWEEP
- Color-coded: green for bullish setups, red for bearish

**Why it matters:** Most retail stops sit exactly at these levels. Identifying sweeps in real-time means you entry exactly where smart money does — after liquidity has been mopped up.

### 2️⃣ 📊 Fair Value Gap (FVG) Mapper

Plots the imbalance zone between three consecutive candles — the single most popular ICT concept.

**How it works:**
- Identifies bullish gaps (candle[2].high < current candle.low) and bearish gaps (candle[2].low > current candle.high)
- Draws shaded horizontal zones extending to the right
- Displays bar counter showing how many bars old each gap is
- Configurable `fvgMaxAge` auto-cleans stale gaps from the chart

**Why it matters:** Price returns to fill FVGs ~70% of the time. Knowing exactly where these unfilled gaps sit gives you high-probability entry/exit zones.

### 3️⃣ 🧱 Order Block Identifier

Flags the last candle before a strong directional move — the literal "order block" where institutional orders were placed.

**How it works:**
- Measures momentum via `(close - close[1]) / close[1]`
- If strong move (>0.2%) after a down candle → marks as 🟢 BULLISH OB
- If strong move (<-0.2%) after an up candle → marks as 🔴 BEARISH OB
- Dotted horizontal lines extend to the right for ongoing reference

**Why it matters:** Order blocks act as support/resistance. Price frequently returns to these levels before continuing the trend or reversing.

### 4️⃣ 📈 Market Structure Break (MSB)

Tracks the sequence of higher highs / higher lows (bullish) and lower highs / lower lows (bearish) with visual break alerts.

**How it works:**
- Uses `ta.pivothigh(5,5)` and `ta.pivotlow(5,5)` for reliable swing points
- When a new swing high breaks the previous higher high → ⚠️ MSB (Bearish)
- When a new swing low breaks the previous lower low → ✅ MSB (Bullish)
- Dashed purple/teal lines connect broken structure points

**Why it matters:** Structure breaks are the earliest signal that the current trend is ending. Identifying them as they happen gives you the edge on trend reversals.

---

## 🎛️ User Controls (Input Parameters)

| Parameter | Type | Default | Description |
|---|---|---|---|
| `showLiqSweeps` | toggle | ON | Show/hide sweep labels |
| `showFVGs` | toggle | ON | Show/hide FVG zones |
| `showOrderBlocks` | toggle | ON | Show/hide OB markers |
| `showStructure` | toggle | ON | Show/hide MSB lines |
| `lookback` | integer | 100 | Sweep/OB detection range |
| `fvgMaxAge` | integer | 20 | Max bars to keep FVG zones visible |
| `obSensitivity` | integer | 3 | Sensitivity for OB detection |
| `sweepTolerance` | float | 0.1% | Tolerance for sweep break detection |

---

## 💰 Pricing & Purchase

| Item | Price | Payment Method |
|---|---|---|
| SMC Pro Pack (all 4 indicators) | **35 USDC** | Native USDC ERC-20 transfer |
| License | Perpetual | One-time, no subscriptions |

**How to buy:**
1. Visit **[smc-pro-pack.surge.sh](https://smc-pro-pack.surge.sh)**
2. Connect your MetaMask / Coinbase Wallet / WalletConnect
3. Send **35 USDC** to the payout wallet
4. Code auto-downloads immediately after on-chain confirmation

**Payout wallet:** `0x34d647d24a296916bee1253fc03dc2b242eaad6f` (Ethereum, USDC ERC-20)

[🔗 Buy Now — 35 USDC](https://smc-pro-pack.surge.sh)

---

## 🔧 Installation

1. **Buy** at [smc-pro-pack.surge.sh](https://smc-pro-pack.surge.sh)
2. Download the `.pine` file (auto-delivered after payment)
3. Open TradingView → Pine Editor (bottom panel)
4. Click **New → Open → Upload .pine file**
5. Select the downloaded `SMC_Pro_Pack.pine`
6. Click **Add to Chart** — done

No dependencies, no npm install, no API keys. Just paste and trade.

---

## ❓ FAQ

**Q: Does this repaint?**  
A: No. All detection is bar-close based. Sweeps and structure breaks trigger on the confirmed bar, not intra-bar.

**Q: Works on crypto, forex, and stocks?**  
A: Yes. Pure price-action logic works on any timeframe and any instrument.

**Q: Can I customize the colors?**  
A: The code is unobfuscated — you can modify colors, labels, and parameters freely.

**Q: Refund policy?**  
A: Digital goods are final. The pack costs less than most TradingView indicator rentals for a single month. You own it forever.

---

## 📊 SEO Keywords

*TradingView SMC indicator, ICT fair value gap script, liquidity sweep Pine Script, order block indicator TradingView, smart money concepts trading tool, market structure break indicator, ICT 2022 model indicator, best SMC indicator TradingView, free FVG indicator, Pine Script v5 trading toolkit, institutional order flow indicator*

---

## 📜 License

One-time purchase. You may use on multiple charts under the same TradingView account. Redistribution or resale of the script file is prohibited.

---

## 🔗 Links

- **[Buy Now](https://smc-pro-pack.surge.sh)** — Instant download after USDC payment
- **[TradingView Pine Script Docs](https://www.tradingview.com/pine-script-docs/en/v5/)** — Official documentation
- **[Etherscan — Verify Payout Wallet](https://etherscan.io/address/0x34d647d24a296916bee1253fc03dc2b242eaad6f)** — Transparency

---

<p align="center">
  <a href="https://smc-pro-pack.surge.sh">
    <img src="https://img.shields.io/badge/🚀_Get_SMC_Pro_Pack-35_USDC-7c3aed?style=for-the-badge&logoColor=white" alt="Buy Now">
  </a>
</p>