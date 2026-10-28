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

// Each request waits for its reply: the CLI may still be downloading (npx fallback without
// node_modules) or starting slowly, so fixed delays made the test fail on its own clock.
const LIMIT_MS = 60_000
function request(id, method, params) {
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, ...(params ? { params } : {}) }) + '\n')
  return new Promise((resolve, reject) => {
    const started = Date.now()
    const poll = setInterval(() => {
      const reply = responses.find(r => r.id === id)
      if (reply) {
        clearInterval(poll)
        resolve(reply)
      }
      else if (Date.now() - started > LIMIT_MS) {
        clearInterval(poll)
        reject(new Error(`No reply to ${method} within ${LIMIT_MS / 1000}s`))
      }
    }, 50)
  })
}

try {
  const initRes = await request(1, 'initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'ci-test', version: '1.0' } })
  assert(initRes.result, 'Should have initialize result')
  assert(initRes.result.capabilities, 'Should have capabilities')

  const pingRes = await request(2, 'ping')
  assert(pingRes.result, 'Should have ping result')

  const resListRes = await request(3, 'resources/list')
  assert(Array.isArray(resListRes.result?.resources), 'Should have resources array')

  const toolsRes = await request(4, 'tools/list')
  assert(Array.isArray(toolsRes.result?.tools) && toolsRes.result.tools.length > 0, 'Should have tools array with tools')

  console.log(`Smoke test passed! Detected ${toolsRes.result.tools.length} MCP tools.`)
  child.kill()
  process.exit(0)
}
catch (error) {
  console.error(error)
  child.kill()
  process.exit(1)
}
