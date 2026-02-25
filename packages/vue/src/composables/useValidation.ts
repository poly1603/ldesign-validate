import { ref, reactive } from 'vue'
import { Schema } from '@ldesign/validate-core'
import type { SchemaDefinition } from '@ldesign/validate-core'

export function useValidation(definition: SchemaDefinition) {
  const schema = new Schema(definition)
  const errors = reactive<Record<string, string[]>>({})
  const isValid = ref(true)
  const isValidating = ref(false)

  async function validateField(field: string, value: any) {
    isValidating.value = true
    try {
      const fieldErrors = await schema.validateField(field, value)
      errors[field] = fieldErrors.map(e => e.message)
      isValid.value = Object.values(errors).every(e => e.length === 0)
    } finally { isValidating.value = false }
  }

  async function validateAll(data: Record<string, any>) {
    isValidating.value = true
    try {
      const result = await schema.validate(data)
      Object.keys(errors).forEach(k => { errors[k] = [] })
      for (const err of result.errors) {
        if (!errors[err.field]) errors[err.field] = []
        errors[err.field].push(err.message)
      }
      isValid.value = result.valid
      return result
    } finally { isValidating.value = false }
  }

  function clearErrors() { Object.keys(errors).forEach(k => { errors[k] = [] }); isValid.value = true }
  function getFieldError(field: string): string | undefined { return errors[field]?.[0] }

  return { errors, isValid, isValidating, validateField, validateAll, clearErrors, getFieldError }
}
