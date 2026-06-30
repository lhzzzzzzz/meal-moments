#!/usr/bin/env node
/**
 * 本地验证 Upstash Redis 是否可用于 @upstash/ratelimit（需要 evalsha 权限）。
 * 用法：node scripts/check-upstash.mjs
 * 会读取 .env.local 中的 UPSTASH_* 或 KV_* 变量。
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvFile(path) {
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = value
  }
}

loadEnvFile(resolve(process.cwd(), '.env.local'))

const url =
  process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN

if (!url || !token) {
  console.error(
    '❌ 未找到 Upstash 环境变量（UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN）'
  )
  process.exit(1)
}

const { Redis } = await import('@upstash/redis')
const { Ratelimit } = await import('@upstash/ratelimit')

const redis = new Redis({ url, token })

try {
  const pong = await redis.ping()
  console.log('✅ ping:', pong)
} catch (error) {
  console.error('❌ ping 失败:', error.message ?? error)
  process.exit(1)
}

try {
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    prefix: 'ratelimit:health-check',
  })
  const result = await ratelimit.limit('health-check')
  console.log('✅ ratelimit.limit:', result.success ? 'ok' : 'limited (expected on repeat)')
} catch (error) {
  console.error('❌ ratelimit 失败（常见：只读 Token 或 Token 无 evalsha 权限）:')
  console.error('  ', error.message ?? error)
  process.exit(1)
}

console.log('\nUpstash 配置正常，可用于生产限流。')
