import type { ValidationRule } from '../types'

/** 自定义同步校验 */
export function custom(
  fn: (value: any) => boolean | string,
  message?: string,
): ValidationRule {
  return {
    name: 'custom',
    message: message || '{field}校验失败',
    validate: (value: any) => {
      const result = fn(value)
      return typeof result === 'string' ? false : result
    },
  }
}

/** 异步校验（如远程唯一性检查） */
export function asyncRule(
  fn: (value: any) => Promise<boolean | string>,
  message?: string,
): ValidationRule {
  return {
    name: 'async',
    message: message || '{field}校验失败',
    validateAsync: async (value: any) => {
      const result = await fn(value)
      return typeof result === 'string' ? false : result
    },
  }
}
