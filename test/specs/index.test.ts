import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadConfig, loadFileCode } from '../../src/index'

const id = 'test'
const config = {
  id,
}
const dir = '../__fixtures__/file'
describe('test', () => {
  test('loadConfig', async () => {
    const dirPath = join(__dirname, dir)
    const { data, path } = await loadConfig(id, join(__dirname, dir))
    expect(data).toEqual(config)
    expect(path).toBe(join(dirPath, (`${id}.config.ts`)))
  })
  test('loadFileCode', async () => {
    const dirPath = join(__dirname, dir)
    const { data, path } = await loadFileCode(join(__dirname, dir, 'test.config.json'))
    expect(data).toEqual(config)
    expect(path).toBe(join(dirPath, (`${id}.config.json`)))
  })
})
