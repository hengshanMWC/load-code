import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import strip from 'strip-json-comments'

export function jsoncParse(data: string) {
  try {
    return new Function(`return ${strip(data).trim()}`)()
  }
  catch {
    // Silently ignore any error
    // That's what tsc/jsonc-parser did after all
    return {}
  }
}

export const JS_EXT_RE = /\.(mjs|cjs|ts|js|tsx|jsx)$/

export function getRandomId() {
  return Math.random().toString(36).substring(2, 15)
}

export async function similarDirectory() {
  const path = await mkdtemp(tmpdir() || process.env.TMPDIR || '/.tmp/load-')
  return path
}
