import type { SchemaDefinition, SchemaField, ValidationResult, ValidationError } from '../types'
import { Validator } from './validator'
import { required, min, max, email, url, pattern } from '../rules'

/**
 * Schema - 声明式校验模式
 */
export class Schema {
  private definition: SchemaDefinition

  constructor(definition: SchemaDefinition) {
    this.definition = definition
  }

  async validate(data: Record<string, any>): Promise<ValidationResult> {
    const validator = new Validator()
    for (const [field, schema] of Object.entries(this.definition)) {
      validator.addField(field, this.buildRules(schema), schema.label || field)
    }
    return validator.validate(data)
  }

  async validateField(field: string, value: any): Promise<ValidationError[]> {
    const schema = this.definition[field]
    if (!schema) return []
    const validator = new Validator()
    validator.addField(field, this.buildRules(schema), schema.label || field)
    return validator.validateField(field, value)
  }

  private buildRules(schema: SchemaField) {
    const rules = []
    if (schema.required) {
      rules.push(required(typeof schema.required === 'string' ? schema.required : undefined))
    }
    if (schema.type === 'email') rules.push(email(schema.message))
    if (schema.type === 'url') rules.push(url(schema.message))
    if (schema.min !== undefined) rules.push(min(schema.min, schema.message))
    if (schema.max !== undefined) rules.push(max(schema.max, schema.message))
    if (schema.pattern) {
      const regex = typeof schema.pattern === 'string' ? new RegExp(schema.pattern) : schema.pattern
      rules.push(pattern(regex, schema.message))
    }
    if (schema.custom) {
      const customFn = schema.custom
      rules.push({
        name: 'custom',
        message: schema.message || '{field}校验失败',
        validateAsync: async (value) => {
          const result = await customFn(value)
          return typeof result === 'string' ? false : result
        },
      })
    }
    return rules
  }
}
