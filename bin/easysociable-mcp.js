#!/usr/bin/env node

import { spawn } from 'node:child_process'

const args = ['mcp', 'serve', ...process.argv.slice(2)]
if (!args.includes('--transport')) {
  args.push('--transport', 'stdio')
}

const child = spawn('npx', ['--yes', '@easysociable/cli', ...args], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

child.on('error', (err) => {
  console.error('[easysociable-mcp] Failed to launch @easysociable/cli:', err)
  process.exit(1)
})
