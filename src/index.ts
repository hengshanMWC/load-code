import { basename, join, parse, relative } from 'node:path'
import { readFile } from 'node:fs/promises'
import JoyCon from 'joycon'
import { bundleRequire } from 'bundle-require'
import { JS_EXT_RE, getRandomId, jsoncParse, similarDirectory } from './utils'

const joycon = new JoyCon()

async function loadJson(filepath: string) {
  try {
    return jsoncParse(await readFile(filepath, 'utf8'))
  }
  catch (error) {
    if (error instanceof Error) {
      throw new TypeError(
        `Failed to parse ${relative(process.cwd(), filepath)}: ${
          error.message
        }`,
      )
    }
    else {
      throw error
    }
  }
}

const jsonLoader = {
  test: /\.json$/,
  load(filepath: string) {
    return loadJson(filepath)
  },
}

joycon.addLoader(jsonLoader)

async function buildFile (configPath: string) {
  const similarDirectoryPath = await similarDirectory()
  const config = await bundleRequire({
    filepath: configPath,
    getOutputFile(filepath, format) {
      return join(similarDirectoryPath, basename(filepath)).replace(
        JS_EXT_RE,
        `.bundled_${getRandomId()}.${format === 'esm' ? 'mjs' : 'cjs'}`)
    },
  })
  return config
}

export async function loadConfig<T = any>(
  cli: string,
  cwd = process.cwd(),
): Promise<{ path?: string; data?: T }> {
  const configJoycon = new JoyCon()
  const configPath = await configJoycon.resolve(
    [
      `${cli}.config.ts`,
      `${cli}.config.js`,
      `${cli}.config.cjs`,
      `${cli}.config.mjs`,
      `${cli}.config.json`,
    ],
    cwd,
    parse(cwd).root,
  )

  if (configPath) {
    if (configPath.endsWith('.json')) {
      let data = await loadJson(configPath)
      if (configPath.endsWith('package.json')) {
        data = data[cli]
      }
      if (data) {
        return { path: configPath, data }
      }
      return {}
    }
    const config = await buildFile(configPath)

    return {
      path: configPath,
      data: config.mod[cli] || config.mod.default || config.mod,
    }
  }

  return {}
}

export async function loadFileCode<T = any>(
  filePath: string,
): Promise<{ path?: string; data?: T }> {
  const configJoycon = new JoyCon()
  const configPath = await configJoycon.resolve(
    [filePath]
  )

  if (configPath) {
    if (configPath.endsWith('.json')) {
      let data = await loadJson(configPath)
      if (data) {
        return { path: configPath, data }
      }
      return {}
    }

    const config = await buildFile(configPath)

    return {
      path: configPath,
      data: config.mod.default || config.mod,
    }
  }

  return {}
}
