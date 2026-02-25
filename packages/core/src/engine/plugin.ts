/**
 * @ldesign/validate Engine 插件
 */
import type { ValidateEnginePluginOptions } from './types'
import { ValidationEngine } from '../core/validation-engine'

export const validateStateKeys = {
  ENGINE: 'validate:engine' as const,
} as const

export const validateEventKeys = {
  INSTALLED: 'validate:installed' as const,
  UNINSTALLED: 'validate:uninstalled' as const,
  VALIDATED: 'validate:validated' as const,
} as const

export function createValidateEnginePlugin(options: ValidateEnginePluginOptions = {}) {
  let engine_instance: ValidationEngine | null = null

  return {
    name: 'validate',
    version: '1.0.0',
    dependencies: options.dependencies ?? [],

    async install(context: any) {
      const engine = context.engine || context
      engine_instance = new ValidationEngine()

      // 预注册 schemas
      if (options.schemas) {
        for (const [name, def] of Object.entries(options.schemas)) {
          engine_instance.registerSchema(name, def)
        }
      }

      engine.state?.set(validateStateKeys.ENGINE, engine_instance)
      engine.events?.emit(validateEventKeys.INSTALLED, { name: 'validate' })
      engine.logger?.info('[Validate Plugin] installed successfully')
    },

    async uninstall(context: any) {
      const engine = context.engine || context
      engine_instance?.destroy()
      engine_instance = null
      engine.state?.delete(validateStateKeys.ENGINE)
      engine.events?.emit(validateEventKeys.UNINSTALLED, {})
      engine.logger?.info('[Validate Plugin] uninstalled')
    },
  }
}
