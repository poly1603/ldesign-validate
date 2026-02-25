import type { SchemaDefinition, ValidationResult } from '../types'
import { Schema } from './schema'
import { Validator } from './validator'

/**
 * ValidationEngine - 校验引擎（高级 API）
 * 提供全局规则注册、schema 缓存、校验中间件
 */
export class ValidationEngine {
  private schemas = new Map<string, Schema>()
  private middlewares: Array<(data: any, result: ValidationResult) => ValidationResult> = []

  registerSchema(name: string, definition: SchemaDefinition): this {
    this.schemas.set(name, new Schema(definition))
    return this
  }

  removeSchema(name: string): this {
    this.schemas.delete(name)
    return this
  }

  async validateBySchema(name: string, data: Record<string, any>): Promise<ValidationResult> {
    const schema = this.schemas.get(name)
    if (!schema) {
      return { valid: false, errors: [{ field: '', rule: 'schema', message: `Schema "${name}" 未注册` }] }
    }
    return this.applyMiddlewares(data, await schema.validate(data))
  }

  async validate(definition: SchemaDefinition, data: Record<string, any>): Promise<ValidationResult> {
    const schema = new Schema(definition)
    return this.applyMiddlewares(data, await schema.validate(data))
  }

  createValidator(): Validator {
    return new Validator()
  }

  use(middleware: (data: any, result: ValidationResult) => ValidationResult): this {
    this.middlewares.push(middleware)
    return this
  }

  destroy(): void {
    this.schemas.clear()
    this.middlewares.length = 0
  }

  private applyMiddlewares(data: any, result: ValidationResult): ValidationResult {
    return this.middlewares.reduce((r, mw) => mw(data, r), result)
  }
}
