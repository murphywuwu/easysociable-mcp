#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SHADE_SPECS = {
  50: { l: 97, sMul: 0.8 },
  100: { l: 94, sMul: 0.8 },
  200: { l: 87, sMul: 0.85 },
  300: { l: 75, sMul: 0.9 },
  400: { l: 62, sMul: 0.95 },
  500: { l: 48, sMul: 1.0 },
  600: { l: 40, sMul: 1.0 },
  700: { l: 33, sMul: 1.0 },
  800: { l: 27, sMul: 1.0 },
  900: { l: 20, sMul: 1.0 },
  950: { l: 10, sMul: 1.0 },
}

const SEMANTIC_LIGHT = {
  canvas: '#FFFFFF',
  text: '950',
  accent: '700',
  muted: '800',
  primary: '800',
  border: '200',
}

const SEMANTIC_DARK = {
  canvas: '950',
  text: '50',
  accent: '400',
  muted: '400',
  primary: '700',
  border: '800',
}

function parseArgs(argv) {
  const options = {
    hex: null,
    mode: null,
    heading: null,
    body: null,
    output: null,
    preset: null,
    listPresets: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--mode') {
      options.mode = argv[++i]
      continue
    }
    if (arg === '--heading') {
      options.heading = argv[++i]
      continue
    }
    if (arg === '--body') {
      options.body = argv[++i]
      continue
    }
    if (arg === '--output' || arg === '-o') {
      options.output = argv[++i]
      continue
    }
    if (arg === '--preset') {
      options.preset = argv[++i]
      continue
    }
    if (arg === '--list-presets') {
      options.listPresets = true
      continue
    }
    if (arg.startsWith('#'))
      options.hex = arg
  }

  return options
}

function loadPresets() {
  const presetsPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../references/theme-presets.json',
  )
  const raw = JSON.parse(fs.readFileSync(presetsPath, 'utf8'))
  return raw.presets ?? []
}

function resolvePreset(presetId) {
  const presets = loadPresets()
  const preset = presets.find((item) => item.id === presetId)
  if (!preset)
    throw new Error(`Unknown preset "${presetId}". Use --list-presets.`)
  return preset
}

function applyPresetDefaults(options) {
  if (!options.preset)
    return {
      ...options,
      mode: options.mode ?? 'light',
      heading: options.heading ?? 'Inter',
      body: options.body ?? 'Inter',
    }

  const preset = resolvePreset(options.preset)
  return {
    ...options,
    hex: options.hex ?? preset.brandHex,
    mode: options.mode ?? preset.mode ?? 'light',
    heading: options.heading ?? preset.fonts?.heading ?? 'Inter',
    body: options.body ?? preset.fonts?.body ?? 'Inter',
    presetMeta: {
      id: preset.id,
      name: preset.name,
      bestFor: preset.bestFor,
      notFor: preset.notFor,
    },
  }
}

function hexToHsl(hex) {
  const normalized = hex.replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(normalized))
    throw new Error(`Invalid hex color: ${hex}`)

  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  let l = (max + min) / 2
  let s = 0

  if (diff !== 0)
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)

  let h = 0
  if (diff !== 0) {
    if (max === r)
      h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
    else if (max === g)
      h = ((b - r) / diff + 2) / 6
    else
      h = ((r - g) / diff + 4) / 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function hslToHex(h, s, l) {
  const sat = s / 100
  const light = l / 100
  const c = (1 - Math.abs(2 * light - 1)) * sat
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = light - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
  }
  else if (h < 120) {
    r = x
    g = c
  }
  else if (h < 180) {
    g = c
    b = x
  }
  else if (h < 240) {
    g = x
    b = c
  }
  else if (h < 300) {
    r = x
    b = c
  }
  else {
    r = c
    b = x
  }

  const toHex = (value) => Math.round((value + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function generateScale(brandHex) {
  const { h, s } = hexToHsl(brandHex)
  const scale = {}

  for (const [shade, { l, sMul }] of Object.entries(SHADE_SPECS))
    scale[shade] = hslToHex(h, Math.round(s * sMul), l)

  return scale
}

function resolveSemantic(scale, mapping) {
  const colors = {}
  for (const [token, value] of Object.entries(mapping)) {
    if (value.startsWith('#'))
      colors[token] = value
    else
      colors[token] = scale[value]
  }
  return colors
}

function getLuminance(hex) {
  const normalized = hex.replace(/^#/, '')
  const channels = [
    Number.parseInt(normalized.slice(0, 2), 16) / 255,
    Number.parseInt(normalized.slice(2, 4), 16) / 255,
    Number.parseInt(normalized.slice(4, 6), 16) / 255,
  ].map((channel) => (
    channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4
  ))

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function getContrastRatio(foreground, background) {
  const lighter = Math.max(getLuminance(foreground), getLuminance(background))
  const darker = Math.min(getLuminance(foreground), getLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

function buildContrastReport(light, dark) {
  const modes = [
    { mode: 'light', palette: light, buttonForeground: light.canvas },
    { mode: 'dark', palette: dark, buttonForeground: dark.text },
  ]
  const pairs = [
    { pair: 'text/canvas', foregroundKey: 'text', backgroundKey: 'canvas', minAA: 4.5 },
    { pair: 'muted/canvas', foregroundKey: 'muted', backgroundKey: 'canvas', minAA: 4.5 },
    { pair: 'accent/canvas', foregroundKey: 'accent', backgroundKey: 'canvas', minAA: 3 },
  ]

  return modes.flatMap(({ mode, palette, buttonForeground }) => {
    const base = pairs.map(({ pair, foregroundKey, backgroundKey, minAA }) => {
      const foreground = palette[foregroundKey]
      const background = palette[backgroundKey]
      const ratio = Number(getContrastRatio(foreground, background).toFixed(2))
      return {
        pair,
        mode,
        foreground,
        background,
        ratio,
        wcagAA: ratio >= minAA,
        wcagAAA: ratio >= 7,
      }
    })
    const buttonRatio = Number(getContrastRatio(buttonForeground, palette.primary).toFixed(2))
    base.push({
      pair: 'label/primary',
      mode,
      foreground: buttonForeground,
      background: palette.primary,
      ratio: buttonRatio,
      wcagAA: buttonRatio >= 3,
      wcagAAA: buttonRatio >= 7,
    })
    return base
  })
}

function buildThemeTokens(colors, fonts, surfaces, palette) {
  return {
    colors: {
      canvas: colors.canvas,
      text: colors.text,
      accent: colors.accent,
      muted: colors.muted,
      primary: colors.primary,
      border: colors.border,
    },
    fonts: {
      heading: fonts.heading,
      body: fonts.body,
    },
    surfaces: {
      radius: surfaces.radius,
      shadow: surfaces.shadow,
    },
    palette,
  }
}

function generateThemeTokens(options) {
  const scale = generateScale(options.hex)
  const light = resolveSemantic(scale, SEMANTIC_LIGHT)
  const dark = resolveSemantic(scale, SEMANTIC_DARK)
  const contrast = buildContrastReport(light, dark)
  const surfaces = {
    radius: '12px',
    shadow: options.mode === 'dark'
      ? '0 8px 24px rgba(0,0,0,.45)'
      : '0 8px 24px rgba(0,0,0,.12)',
  }
  const fonts = { heading: options.heading, body: options.body }
  const activePalette = options.mode === 'dark' ? dark : light
  const palette = {
    brandHex: options.hex.toUpperCase(),
    scale,
    activeMode: options.mode,
    semantic: { light, dark },
    contrast,
    contrastPass: contrast.every((entry) => entry.wcagAA),
  }

  return {
    schemaVersion: 'theme_tokens_v2',
    brandHex: options.hex.toUpperCase(),
    scale,
    semantic: { light, dark },
    activeMode: options.mode,
    preset: options.presetMeta ?? null,
    themeTokens: buildThemeTokens(activePalette, fonts, surfaces, palette),
    themeTokensLight: buildThemeTokens(light, fonts, surfaces, { ...palette, activeMode: 'light' }),
    themeTokensDark: buildThemeTokens(dark, fonts, surfaces, { ...palette, activeMode: 'dark' }),
    contrast,
    contrastPass: palette.contrastPass,
  }
}

function printSummary(result) {
  if (result.preset)
    console.log(`Preset: ${result.preset.id} (${result.preset.name})`)
  console.log(`Brand: ${result.brandHex}`)
  console.log(`Active mode: ${result.activeMode}`)
  console.log(`Contrast pass (AA): ${result.contrastPass ? 'yes' : 'no'}`)
  console.log('Scale:')
  for (const shade of Object.keys(SHADE_SPECS))
    console.log(`  ${shade}: ${result.scale[shade]}`)
  console.log('ThemeTokens (active):')
  console.log(JSON.stringify(result.themeTokens, null, 2))
  if (!result.contrastPass) {
    console.error('Contrast failures:')
    result.contrast
      .filter((entry) => !entry.wcagAA)
      .forEach((entry) => console.error(`  - [${entry.mode}] ${entry.pair}: ${entry.ratio}:1`))
  }
}

function main() {
  const raw = parseArgs(process.argv.slice(2))
  if (raw.listPresets) {
    loadPresets().forEach((preset) => {
      console.log(`${preset.id}\t${preset.name}\t${preset.brandHex}\t${preset.mode}\t${preset.bestFor}`)
    })
    return
  }

  let options
  try {
    options = applyPresetDefaults(raw)
  }
  catch (error) {
    console.error(error.message)
    process.exit(2)
  }

  if (!options.hex) {
    console.error('Usage: node generate-theme-from-hex.mjs <#hex|--preset id> [--mode light|dark] [--heading Font] [--body Font] [--output path]')
    console.error('       node generate-theme-from-hex.mjs --list-presets')
    process.exit(2)
  }
  if (!['light', 'dark'].includes(options.mode)) {
    console.error('--mode must be light or dark')
    process.exit(2)
  }

  const result = generateThemeTokens(options)
  const json = `${JSON.stringify(result, null, 2)}\n`

  if (options.output) {
    fs.writeFileSync(path.resolve(options.output), json)
    console.log(`Wrote ${path.resolve(options.output)}`)
  }
  else {
    process.stdout.write(json)
  }

  printSummary(result)
  if (!result.contrastPass)
    process.exit(1)
}

main()
