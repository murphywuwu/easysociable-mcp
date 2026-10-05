#!/usr/bin/env node

import { spawn } from 'node:child_process'
import readline from 'node:readline'

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
  stdio: ['pipe', 'inherit', 'inherit'],
  env,
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return

  try {
    const msg = JSON.parse(trimmed)
    if (msg.method === 'ping') {
      const response = JSON.stringify({
        jsonrpc: '2.0',
        id: msg.id,
        result: {},
      })
      process.stdout.write(response + '\n')
      return
    }
  } catch {
    // If not valid JSON, simply forward
  }

  child.stdin.write(line + '\n')
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

child.on('error', (err) => {
  console.error('[easysociable-mcp] Failed to launch @easysociable/cli:', err)
  process.exit(1)
})
