# introduce
读取文件配置

# install
```
npm i load-code
```

# use
读取文件优先级test.config.ts->test.config.js->test.config.cjs->test.config.js->test.config.mjs->test.config.json->package.json的test字段
```ts
import { loadConfig } from 'load-code'

// 传配置名，基于配置名，读取配置
const configData = await loadConfig('test')
```
```ts
function loadConfig<T = any>(cli: string, cwd?: string): Promise<{
  path?: string // 配置文件路径
  data?: T // 配置数据
}>
```


