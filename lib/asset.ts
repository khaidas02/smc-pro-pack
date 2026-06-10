// ============================================================
//  Asset payload — embedded Pine Script code
//  Only revealed after successful crypto payment
// ============================================================

export const ASSET_CODE = `//@version=5
indicator("SMC Pro Pack", overlay=true, max_bars_back=500, max_labels_count=500)

// ============================================================
//  SMC PRO PACK — 4 Smart Money Concepts Indicators
//  Liquidity Sweep · Fair Value Gap · Order Block · Structure
//  Licensed — Unauthorized distribution is prohibited
// ============================================================

// ---------- USER INPUTS ----------
showLiqSweeps       = input.bool(true,  "🔴 Liquidity Sweeps")
showFVGs            = input.bool(true,  "📊 Fair Value Gaps")
showOrderBlocks     = input.bool(true,  "🧱 Order Blocks")
showStructure       = input.bool(true,  "📈 Market Structure")
lookback            = input.int(100,    "Lookback Period", minval=30)
fvgMaxAge           = input.int(20,    "FVG Max Age (bars)", minval=5)
obSensitivity       = input.int(3,    "Order Block Sensitivity", minval=1, maxval=10)
sweepTolerance      = input.float(0.001, "Sweep Tolerance (%)", step=0.0005)

// ============================================================
//  MODULE 1: LIQUIDITY SWEEP DETECTOR
// ============================================================
var label[] sweepLabels = na
var int[]   sweepBarIndex = na
if na(sweepLabels)
    sweepLabels := array.new<label>()
    sweepBarIndex := array.new<int>()

detectSweeps() =>
    bool isSweep = false
    string sweepType = ""
    int sweepBar = na
    for i = 1 to lookback
        swingLow = ta.lowest(low, i)
        if low[1] < swingLow[1] and close > swingLow[1] and low[1] == swingLow
            isSweep := true
            sweepType := "Bullish Sweep"
            sweepBar := bar_index[1]
            break
    if not isSweep
        for i = 1 to lookback
            swingHigh = ta.highest(high, i)
            if high[1] > swingHigh[1] and close < swingHigh[1] and high[1] == swingHigh
                isSweep := true
                sweepType := "Bearish Sweep"
                sweepBar := bar_index[1]
                break
    [isSweep, sweepType, sweepBar]

if showLiqSweeps
    [sweep, sType, sBar] = detectSweeps()
    if sweep and not na(sBar)
        label.new(
             sBar, 
             sType == "Bullish Sweep" ? low[sBar - bar_index + 1] * 0.998 : high[sBar - bar_index + 1] * 1.002,
             sType == "Bullish Sweep" ? "⚡ BUY-SIDE LIQ SWEEP" : "⚡ SELL-SIDE LIQ SWEEP",
             style=sType == "Bullish Sweep" ? label.style_label_up : label.style_label_down,
             color=sType == "Bullish Sweep" ? color.green : color.red,
             textcolor=sType == "Bullish Sweep" ? color.new(color.green, 20) : color.new(color.red, 20),
             size=size.small
        )

// ============================================================
//  MODULE 2: FAIR VALUE GAP (FVG) MAPPER
// ============================================================
detectFVG() =>
    float fvgTop = na
    float fvgBot = na
    int fvgStart = na
    if high[2] < low
        fvgTop := low
        fvgBot := high[2]
        fvgStart := bar_index[2]
    else if low[2] > high
        fvgTop := low[2]
        fvgBot := high
        fvgStart := bar_index[2]
    [fvgTop, fvgBot, fvgStart]

if showFVGs
    [fvgTop, fvgBot, fvgStart] = detectFVG()
    if not na(fvgTop) and not na(fvgBot) and not na(fvgStart)
        if math.abs(fvgTop - fvgBot) / close > 0.0002
            barsAgo = bar_index - fvgStart
            if barsAgo <= fvgMaxAge
                line.new(
                    fvgStart, fvgTop, fvgStart + 1, fvgBot,
                    extend=extend.right,
                    color=color.new(color.blue, 60),
                    style=line.style_solid, width=2
                )
                label.new(
                    fvgStart, (fvgTop + fvgBot) / 2,
                    str.tostring(barsAgo) + " bars",
                    style=label.style_none,
                    textcolor=color.new(color.blue, 30), size=size.tiny
                )

// ============================================================
//  MODULE 3: ORDER BLOCK IDENTIFIER
// ============================================================
if showOrderBlocks
    strongMove = (close - close[1]) / close[1]
    if strongMove > 0.002 and close[1] < open[1] and close[1] < close[2]
        obTop = math.max(high[1], open[1])
        obBot = math.min(low[1], close[1])
        line.new(bar_index[1], obTop, bar_index[1]+1, obBot,
            extend=extend.right,
            color=color.new(color.green, 50),
            style=line.style_dotted, width=1)
        label.new(bar_index[1], obBot, "🟢 BULLISH OB",
            style=label.style_label_center,
            color=color.new(color.green, 50),
            textcolor=color.white, size=size.tiny)
    else if strongMove < -0.002 and close[1] > open[1] and close[1] > close[2]
        obTop = math.max(high[1], close[1])
        obBot = math.min(low[1], open[1])
        line.new(bar_index[1], obTop, bar_index[1]+1, obBot,
            extend=extend.right,
            color=color.new(color.red, 50),
            style=line.style_dotted, width=1)
        label.new(bar_index[1], obTop, "🔴 BEARISH OB",
            style=label.style_label_center,
            color=color.new(color.red, 50),
            textcolor=color.white, size=size.tiny)

// ============================================================
//  MODULE 4: MARKET STRUCTURE BREAK (MSB)
// ============================================================
var float lastHH = na
var float lastLL = na
var int lastHHBar = na
var int lastLLBar = na

if showStructure
    swingHigh = ta.pivothigh(high, 5, 5)
    swingLow  = ta.pivotlow(low, 5, 5)
    
    if not na(swingHigh)
        if not na(lastHH) and swingHigh > lastHH
            line.new(lastHHBar, lastHH, bar_index, swingHigh,
                color=color.new(color.purple, 40),
                style=line.style_dashed, width=1)
            label.new(bar_index, swingHigh, "⚠️ MSB (Bearish)",
                style=label.style_label_down,
                color=color.new(color.purple, 50),
                textcolor=color.white, size=size.tiny)
        lastHH := swingHigh
        lastHHBar := bar_index
    
    if not na(swingLow)
        if not na(lastLL) and swingLow < lastLL
            line.new(lastLLBar, lastLL, bar_index, swingLow,
                color=color.new(color.teal, 40),
                style=line.style_dashed, width=1)
            label.new(bar_index, swingLow, "✅ MSB (Bullish)",
                style=label.style_label_up,
                color=color.new(color.teal, 50),
                textcolor=color.white, size=size.tiny)
        lastLL := swingLow
        lastLLBar := bar_index

// ============================================================
//  INFO PANEL
// ============================================================
if barstate.islast
    p = "🟣 SMC PRO PACK v1.0\\n━━━━━━━━━━━━━\\n"
    p += "Liquidity Sweeps: " + (showLiqSweeps ? "ON" : "OFF") + "\\n"
    p += "Fair Value Gaps: " + (showFVGs ? "ON" : "OFF") + "\\n"
    p += "Order Blocks: " + (showOrderBlocks ? "ON" : "OFF") + "\\n"
    p += "Market Structure: " + (showStructure ? "ON" : "OFF") + "\\n"
    p += "━━━━━━━━━━━━━\\n🔒 Licensed SMC Pro Pack"
    label.new(bar_index, high * 1.02, p,
         style=label.style_label_center,
         color=color.new(#1e1e2e, 20),
         textcolor=color.white, size=size.small,
         textalign=text.align_center)`

/**
 * Returns a downloadable text blob of the Pine Script code
 */
export function getAssetBlob(): Blob {
  return new Blob([ASSET_CODE], { type: 'text/plain' })
}

/**
 * Triggers download of the Pine Script file
 */
export function downloadAsset(): void {
  const blob = getAssetBlob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'SMC_Pro_Pack.pine'
  a.click()
  URL.revokeObjectURL(url)
}