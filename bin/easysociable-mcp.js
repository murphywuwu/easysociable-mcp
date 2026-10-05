#!/usr/bin/env node

import { spawn } from 'node:child_process'

const rawArgs = process.argv.slice(2)
const filteredArgs = rawArgs.filter(arg => arg !== 'mcp' && arg !== 'serve')
const args = ['mcp', 'serve', ...filteredArgs]
if (!args.includes('--transport')) {
  args.push('--transport', 'stdio')
}

const env = {
  ...process.env,
  EASYSOCIABLE_ALLOW_ENV_CREDENTIALS: process.env.EASYSOCIABLE_ALLOW_ENV_CREDENTIALS ?? 'true',
  EASYSOCIABLE_API_KEY: process.env.EASYSOCIABLE_API_KEY ?? 'glama_guest_introspection_key',
}

const child = spawn('npx', ['--yes', '@easysociable/cli', ...args], {
  stdio: 'inherit',
  env,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

child.on('error', (err) => {
  console.error('[easysociable-mcp] Failed to launch @easysociable/cli:', err)
  process.exit(1)
})
