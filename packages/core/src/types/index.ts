/**
 * @ldesign/validate-core 类型定义
 */

/** 校验规则 */
export interface ValidationRule<T = any> {
  name: string
  message: string | ((field: string, value: T, param?: any) => string)
  validate?: (value: T, param?: any) => boolean
  validateAsync?: (value: T, param?: any) => Promise<boolean>
  param?: any
}

/** 字段校验配置 */
export interface FieldRules<T = any> {
  field: string
  label?: string
  rules: ValidationRule<T>[]
}

/** 校验结果 */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

/** 校验错误 */
export interface ValidationError {
  field: string
  rule: string
  message: string
}

/** Schema 字段定义 */
export interface SchemaField {
  label?: string
  required?: boolean | string
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url'
  min?: number
  max?: number
  pattern?: RegExp | string
  custom?: (value: any) => boolean | string | Promise<boolean | string>
  message?: string
}

export type SchemaDefinition = Record<string, SchemaField>

export interface ValidateOptions {
  firstError?: boolean
  skipEmpty?: boolean
}
