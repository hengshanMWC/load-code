import { mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'

export async function similarDirectory(prefix: string, dir?: string) {
  const path = await mkdtemp(`${process.env.TMPDIR || '/.tmp/code-'}${prefix}-`)
  return dir ? join(path, dir) : path
}
