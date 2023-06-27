import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { loadConfig } from '../../src/index'

const id = 'test'
const config = {
  id,
}
describe('test', () => {
  test('base', async () => {
    const dirPath = join(__dirname, '../__fixtures__/file')
    const { data, path } = await loadConfig(id, join(__dirname, '../__fixtures__/file'))
    expect(data).toEqual(config)
    expect(path).toBe(join(dirPath, (`${id}.config.ts`)))
  })
})
