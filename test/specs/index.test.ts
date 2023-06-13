import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import type { TransformOptions } from 'esbuild'
import { loadCjsCode, loadEsmCode } from '../../src/index'
import testData from '../__fixtures__/file/test'

async function handleTest(ext: string, loader?: TransformOptions['loader']) {
  const jsData = await loadCjsCode(join(__dirname, `../__fixtures__/file/test.${ext}`), loader)
  expect(getExportDefault(jsData)).toEqual(testData)
}

async function handleTest2(ext: string, loader?: TransformOptions['loader']) {
  const fn = await loadEsmCode(join(__dirname, `../__fixtures__/file/test.${ext}`), loader)
  const jsData = await fn()
  console.log(jsData)
  expect(getExportDefault(jsData)).toEqual(testData)
}
export function getExportDefault(code: any) {
  return code?.__esModule ? code.default : code
}
describe('test', () => {
  test('loadCjsCode', async () => {
    const arr = ['ts', 'js', 'mjs'].map((key) => {
      return handleTest(key)
    })
    arr.push(handleTest('cjs', 'js'))
    await arr
  })
  test('loadEsmCode', async () => {
    const arr = ['ts', 'js', 'mjs'].map((key) => {
      return handleTest2(key)
    })
    arr.push(handleTest2('cjs', 'js'))
    await arr
  })
})
