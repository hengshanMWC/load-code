import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import type { TransformOptions } from 'esbuild'
import { loadCode } from '../../src/index'
import testData from '../__fixtures__/file/test'

async function handleTest(ext: string, loader?: TransformOptions['loader']) {
  const jsData = await loadCode(join(__dirname, `../__fixtures__/file/test.${ext}`), loader)
  expect(getExportDefault(jsData)).toEqual(testData)
}
export function getExportDefault(code: any) {
  return code?.__esModule ? code.default : code
}
describe('test', () => {
  test('demo', async () => {
    const arr = ['ts', 'js', 'mjs'].map((key) => {
      return handleTest(key)
    })
    arr.push(handleTest('cjs', 'js'))
    await arr
  })
})
