import type { ValidationRule } from '../types'

export function required(message?: string): ValidationRule {
  return {
    name: 'required',
    message: message || '{field}不能为空',
    validate: (value: any) => {
      if (value === null || value === undefined) return false
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return true
    },
  }
}

export function min(limit: number, message?: string): ValidationRule {
  return {
    name: 'min',
    message: message || '{field}不能小于{param}',
    param: limit,
    validate: (value: any, param: number) => {
      if (typeof value === 'string') return value.length >= param
      if (typeof value === 'number') return value >= param
      if (Array.isArray(value)) return value.length >= param
      return true
    },
  }
}

export function max(limit: number, message?: string): ValidationRule {
  return {
    name: 'max',
    message: message || '{field}不能大于{param}',
    param: limit,
    validate: (value: any, param: number) => {
      if (typeof value === 'string') return value.length <= param
      if (typeof value === 'number') return value <= param
      if (Array.isArray(value)) return value.length <= param
      return true
    },
  }
}

export function email(message?: string): ValidationRule {
  return {
    name: 'email',
    message: message || '{field}格式不正确',
    validate: (value: any) => {
      if (!value) return true
      return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(String(value))
    },
  }
}

export function url(message?: string): ValidationRule {
  return {
    name: 'url',
    message: message || '{field}不是有效的 URL',
    validate: (value: any) => {
      if (!value) return true
      try { new URL(String(value)); return true } catch { return false }
    },
  }
}

export function pattern(regex: RegExp, message?: string): ValidationRule {
  return {
    name: 'pattern',
    message: message || '{field}格式不正确',
    param: regex,
    validate: (value: any, param: RegExp) => {
      if (!value) return true
      return param.test(String(value))
    },
  }
}

/** 手机号校验（中国大陆，支持 +86 前缀） */
export function phone(message?: string): ValidationRule {
  return {
    name: 'phone',
    message: message || '{field}不是有效的手机号',
    validate: (value: any) => {
      if (!value) return true
      const s = String(value).replace(/^\+86\s*/, '').replace(/[\s-]/g, '')
      return /^1[3-9]\d{9}$/.test(s)
    },
  }
}

/** 身份证号校验（中国大陆 18 位，含校验位算法） */
export function idCard(message?: string): ValidationRule {
  return {
    name: 'idCard',
    message: message || '{field}不是有效的身份证号',
    validate: (value: any) => {
      if (!value) return true
      const s = String(value)
      if (!/^\d{17}[\dXx]$/.test(s)) return false
      // 校验位算法
      const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      const checks = '10X98765432'
      let sum = 0
      for (let i = 0; i < 17; i++) sum += parseInt(s[i]) * weights[i]
      return s[17].toUpperCase() === checks[sum % 11]
    },
  }
}

/** 整数校验 */
export function integer(message?: string): ValidationRule {
  return {
    name: 'integer',
    message: message || '{field}必须是整数',
    validate: (value: any) => {
      if (value === null || value === undefined || value === '') return true
      return Number.isInteger(Number(value))
    },
  }
}

/** 数值范围校验 */
export function range(minVal: number, maxVal: number, message?: string): ValidationRule {
  return {
    name: 'range',
    message: message || `{field}必须在 ${minVal} 到 ${maxVal} 之间`,
    param: { min: minVal, max: maxVal },
    validate: (value: any, param: { min: number; max: number }) => {
      if (value === null || value === undefined || value === '') return true
      const num = Number(value)
      return !isNaN(num) && num >= param.min && num <= param.max
    },
  }
}

/** 等值校验（确认密码等场景） */
export function equals(compareValue: any, message?: string): ValidationRule {
  return {
    name: 'equals',
    message: message || '{field}与目标值不一致',
    param: compareValue,
    validate: (value: any, param: any) => {
      if (!value && !param) return true
      return value === param
    },
  }
}

/** 精确长度校验 */
export function length(len: number, message?: string): ValidationRule {
  return {
    name: 'length',
    message: message || `{field}长度必须为 {param}`,
    param: len,
    validate: (value: any, param: number) => {
      if (!value) return true
      if (typeof value === 'string' || Array.isArray(value)) return value.length === param
      return String(value).length === param
    },
  }
}
