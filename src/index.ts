import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import type { TransformOptions } from 'esbuild'
import { transform } from 'esbuild'

export function requireLoad(code: string) {
  const fn = new Function('require', 'exports', 'module', code)
  const mod = { exports: {} }
  const moduleContext = { exports: mod.exports, module: mod }
  fn(require, mod.exports, moduleContext.module)
  return mod.exports
}
export async function loadCode(file: string, loader?: any) {
  const str = await readFile(file, 'utf8')
  const res = await transform(str, {
    loader: loader || getLoaderMap(file),
    format: 'cjs',
  })
  return requireLoad(res.code)
}
const loaderMap = {
  cjs: 'js',
  mjs: 'js',
  jsx: 'jsx',
  ts: 'ts',
  tsx: 'tsx',
}
function getLoaderMap(file: string): TransformOptions['loader'] {
  const ext = extname(file).slice(1)
  return loaderMap[ext] || 'js'
}
