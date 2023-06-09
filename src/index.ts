import { readFile } from 'node:fs/promises'
import { transform } from 'esbuild'

export function requireLoad(code: string) {
  const fn = new Function('require', 'exports', 'module', code)
  const mod = { exports: {} }
  const moduleContext = { exports: mod.exports, module: mod }
  fn(require, mod.exports, moduleContext.module)
  return mod.exports
}
export async function loadCode(file: string) {
  const str = await readFile(file, 'utf8')
  const res = await transform(str, {
    format: 'cjs',
  })
  return requireLoad(res.code)
}
// loadCode(join(__dirname, 'pkgs.ts'))
//   .then((res) => {
//     console.log(res.default)
//   })
