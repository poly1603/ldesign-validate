import { ref, watch, reactive, type Ref } from 'vue'
import { Schema } from '@ldesign/validate-core'
import type { SchemaDefinition } from '@ldesign/validate-core'

export function useFormValidation<T extends Record<string, any>>(
  formData: Ref<T> | T,
  definition: SchemaDefinition,
  options?: { immediate?: boolean; debounce?: number },
) {
  const schema = new Schema(definition)
  const errors = reactive<Record<string, string[]>>({})
  const isValid = ref(true)
  const isValidating = ref(false)
  const isDirty = ref(false)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const getData = () => ('value' in formData ? (formData as Ref<T>).value : formData) as Record<string, any>

  async function validate(): Promise<boolean> {
    isValidating.value = true
    try {
      const result = await schema.validate(getData())
      Object.keys(errors).forEach(k => { errors[k] = [] })
      for (const err of result.errors) {
        if (!errors[err.field]) errors[err.field] = []
        errors[err.field].push(err.message)
      }
      isValid.value = result.valid
      return result.valid
    } finally { isValidating.value = false }
  }

  async function validateField(field: string) {
    isValidating.value = true
    try {
      const fieldErrors = await schema.validateField(field, getData()[field])
      errors[field] = fieldErrors.map(e => e.message)
      isValid.value = Object.values(errors).every(e => e.length === 0)
    } finally { isValidating.value = false }
  }

  function reset() { Object.keys(errors).forEach(k => { errors[k] = [] }); isValid.value = true; isDirty.value = false }

  async function handleSubmit(onSuccess: (data: T) => void, onError?: (errors: Record<string, string[]>) => void) {
    const valid = await validate()
    if (valid) onSuccess(getData() as T)
    else onError?.(errors)
  }

  if (options?.immediate !== false) {
    watch(() => getData(), () => {
      isDirty.value = true
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => validate(), options?.debounce ?? 300)
    }, { deep: true })
  }

  return { errors, isValid, isValidating, isDirty, validate, validateField, reset, handleSubmit }
}
