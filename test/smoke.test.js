import { spawn } from 'node:child_process'
import readline from 'node:readline'
import assert from 'node:assert'

const child = spawn('node', ['./bin/easysociable-mcp.js'], {
  stdio: ['pipe', 'pipe', 'inherit'],
})

const rl = readline.createInterface({ input: child.stdout })
const responses = []

rl.on('line', (line) => {
  try {
    const json = JSON.parse(line)
    responses.push(json)
  } catch {
    // ignore
  }
})

function send(msg) {
  child.stdin.write(JSON.stringify(msg) + '\n')
}

// 1. initialize
send({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'ci-test', version: '1.0' },
  },
})

// 2. ping
setTimeout(() => {
  send({ jsonrpc: '2.0', id: 2, method: 'ping' })
}, 300)

// 3. resources/list
setTimeout(() => {
  send({ jsonrpc: '2.0', id: 3, method: 'resources/list' })
}, 600)

// 4. tools/list
setTimeout(() => {
  send({ jsonrpc: '2.0', id: 4, method: 'tools/list' })
}, 900)

setTimeout(() => {
  child.kill()

  const initRes = responses.find(r => r.id === 1)
  assert(initRes && initRes.result, 'Should have initialize result')
  assert(initRes.result.capabilities, 'Should have capabilities')

  const pingRes = responses.find(r => r.id === 2)
  assert(pingRes && pingRes.result, 'Should have ping result')

  const resListRes = responses.find(r => r.id === 3)
  assert(resListRes && Array.isArray(resListRes.result?.resources), 'Should have resources array')

  const toolsRes = responses.find(r => r.id === 4)
  assert(toolsRes && Array.isArray(toolsRes.result?.tools) && toolsRes.result.tools.length > 0, 'Should have tools array with tools')

  console.log(`Smoke test passed! Detected ${toolsRes.result.tools.length} MCP tools.`)
  process.exit(0)
}, 1800)
