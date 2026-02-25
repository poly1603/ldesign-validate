import type { SchemaDefinition } from '../types'

export interface ValidateEnginePluginOptions {
  /** 预注册的 Schema 定义 */
  schemas?: Record<string, SchemaDefinition>
  /** 插件依赖 */
  dependencies?: string[]
}
