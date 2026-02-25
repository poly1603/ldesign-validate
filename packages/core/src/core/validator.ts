import type { ValidationRule, ValidationResult, ValidationError, FieldRules, ValidateOptions } from '../types'

/**
 * 校验器 - 执行字段级别的校验
 */
export class Validator {
  private fieldRulesMap = new Map<string, FieldRules>()

  addField(field: string, rules: ValidationRule[], label?: string): this {
    this.fieldRulesMap.set(field, { field, label: label || field, rules })
    return this
  }

  removeField(field: string): this {
    this.fieldRulesMap.delete(field)
    return this
  }

  async validateField(field: string, value: any): Promise<ValidationError[]> {
    const fieldRules = this.fieldRulesMap.get(field)
    if (!fieldRules) return []

    const errors: ValidationError[] = []
    for (const rule of fieldRules.rules) {
      const valid = rule.validateAsync
        ? await rule.validateAsync(value, rule.param)
        : rule.validate?.(value, rule.param) ?? true

      if (!valid) {
        errors.push({
          field,
          rule: rule.name,
          message: this.formatMessage(rule.message, fieldRules.label || field, value, rule.param),
        })
      }
    }
    return errors
  }

  async validate(data: Record<string, any>, options?: ValidateOptions): Promise<ValidationResult> {
    const errors: ValidationError[] = []

    for (const [field, fieldRules] of this.fieldRulesMap) {
      const value = data[field]

      if (options?.skipEmpty && (value === undefined || value === null || value === '')) {
        const hasRequired = fieldRules.rules.some(r => r.name === 'required')
        if (!hasRequired) continue
      }

      const fieldErrors = await this.validateField(field, value)
      errors.push(...fieldErrors)

      if (options?.firstError && errors.length > 0) {
        return { valid: false, errors }
      }
    }

    return { valid: errors.length === 0, errors }
  }

  clear(): void {
    this.fieldRulesMap.clear()
  }

  private formatMessage(
    message: string | ((field: string, value: any, param?: any) => string),
    field: string, value: any, param?: any,
  ): string {
    if (typeof message === 'function') return message(field, value, param)
    return message
      .replace(/\{field\}/g, field)
      .replace(/\{value\}/g, String(value ?? ''))
      .replace(/\{param\}/g, String(param ?? ''))
  }
}
