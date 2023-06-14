import { readFile } from 'node:fs/promises'
import { extname } from 'node:path'
import type { TransformOptions } from 'esbuild'
import { transform } from 'esbuild'

export function requireCjsLoad(code: string) {
  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', code)
  const mod = { exports: {} }
  const moduleContext = { exports: mod.exports, module: mod }
  return () => {
    fn(mod.exports, require, moduleContext.module, __filename, __dirname)
    return mod.exports
  }
}
export async function loadCjsCode(file: string, loader?: any) {
  const str = await readFile(file, 'utf8')
  const res = await transform(str, {
    loader: loader || getLoaderMap(file),
    format: 'cjs',
  })
  return requireCjsLoad(res.code)
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

// export async function loadEsmCode(file: string, loader?: any) {
//   const str = await readFile(file, 'utf8')
//   const res = await transform(str, {
//     loader: loader || getLoaderMap(file),
//     format: 'esm',
//   })
//   return requireEsmLoad(res.code)
// }

// export async function requireEsmLoad(code: string) {
//   let tempDir
//   try {
//     tempDir = await mkdtemp(process.env.TMPDIR || 'temp-')
//     console.log(tempDir)
//   }
//   catch (err) {
//     console.log(err)
//   }
//   const filePath = `${tempDir}/temp-file.txt`
//   console.log(filePath)
//   await writeFile(filePath, code, 'utf8')
//   return async () => {
//     try {
//       const data = await import(filePath)
//       return data
//     }
//     finally {
//       unlink(filePath)
//     }
//   }
// }
