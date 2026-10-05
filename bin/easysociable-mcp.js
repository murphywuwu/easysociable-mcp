#!/usr/bin/env node

import { spawn } from 'node:child_process'
import readline from 'node:readline'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

console.error('[easysociable-mcp wrapper] Starting stdio MCP server proxy...')

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

// Find actual JS entrypoint (not bash shim in .bin)
const require = createRequire(import.meta.url)
let cliJs = ''
try {
  const pkgPath = require.resolve('@easysociable/cli/package.json')
  const candidate = path.join(path.dirname(pkgPath), 'bin', 'easysociable.js')
  if (fs.existsSync(candidate)) {
    cliJs = candidate
  }
} catch {
  const fallback = path.resolve('node_modules/@easysociable/cli/bin/easysociable.js')
  if (fs.existsSync(fallback)) {
    cliJs = fallback
  }
}

const executable = cliJs ? 'node' : 'npx'
const execArgs = cliJs ? [cliJs, ...args] : ['--yes', '@easysociable/cli', ...args]
console.error('[easysociable-mcp wrapper] Spawning:', executable, execArgs[0])

const child = spawn(executable, execArgs, {
  stdio: ['pipe', 'pipe', 'inherit'],
  env,
})

// Keep track of pending request IDs to know which method failed if -32601 occurs
const pendingMethods = new Map()

function getEmptyResultForMethod(method) {
  if (!method) return {}
  if (method === 'resources/list') return { resources: [] }
  if (method === 'resources/templates/list') return { resourceTemplates: [] }
  if (method === 'prompts/list') return { prompts: [] }
  if (method === 'tools/list') return { tools: [] }
  if (method === 'completion/complete') return { completion: { values: [] } }
  return {}
}

// Handle child process stdout
const childRl = readline.createInterface({
  input: child.stdout,
  terminal: false,
})

childRl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return

  try {
    const msg = JSON.parse(trimmed)
    if (msg.id !== undefined) {
      const method = pendingMethods.get(msg.id)
      pendingMethods.delete(msg.id)

      // If child process returns -32601 Method not found, intercept and resolve cleanly with schema-compliant empty result
      if (msg.error && msg.error.code === -32601) {
        console.error(`[easysociable-mcp wrapper] Overriding child -32601 Method not found for id: ${msg.id} (method: ${method})`)
        const override = JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id,
          result: getEmptyResultForMethod(method),
        })
        process.stdout.write(override + '\n')
        return
      }
    }
  } catch {
    // If not valid JSON, simply forward
  }

  process.stdout.write(line + '\n')
})

// Handle parent process stdin
const rl = readline.createInterface({
  input: process.stdin,
  terminal: false,
})

rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return

  try {
    const msg = JSON.parse(trimmed)

    if (msg.method === 'ping' || msg.method === '$/ping') {
      console.error('[easysociable-mcp wrapper] Intercepted ping request for id:', msg.id)
      const response = JSON.stringify({
        jsonrpc: '2.0',
        id: msg.id,
        result: {},
      })
      process.stdout.write(response + '\n')
      return
    }

    if (msg.method === 'resources/list') {
      console.error('[easysociable-mcp wrapper] Intercepted resources/list request for id:', msg.id)
      const response = JSON.stringify({
        jsonrpc: '2.0',
        id: msg.id,
        result: { resources: [] },
      })
      process.stdout.write(response + '\n')
      return
    }

    if (msg.method === 'prompts/list') {
      console.error('[easysociable-mcp wrapper] Intercepted prompts/list request for id:', msg.id)
      const response = JSON.stringify({
        jsonrpc: '2.0',
        id: msg.id,
        result: { prompts: [] },
      })
      process.stdout.write(response + '\n')
      return
    }

    if (msg.id !== undefined && msg.method) {
      pendingMethods.set(msg.id, msg.method)
    }
  } catch {
    // If not valid JSON, simply forward
  }

  child.stdin.write(line + '\n')
})

child.on('exit', (code) => {
  console.error('[easysociable-mcp wrapper] Child process exited with code:', code)
  process.exit(code ?? 0)
})

child.on('error', (err) => {
  console.error('[easysociable-mcp wrapper] Failed to launch @easysociable/cli:', err)
  process.exit(1)
})
