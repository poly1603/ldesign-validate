import type { App } from 'vue'
import { ValidationEngine } from '@ldesign/validate-core'

export interface ValidatePluginOptions {
  globalEngine?: boolean
}

export function createValidatePlugin(options?: ValidatePluginOptions) {
  const engine = new ValidationEngine()
  return {
    install(app: App) {
      if (options?.globalEngine !== false) {
        app.provide('ldesign-validate-engine', engine)
        app.config.globalProperties.$validate = engine
      }
    },
  }
}
