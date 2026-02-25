<script setup lang="ts">
import { ref } from 'vue'
import { useFormValidation } from '@ldesign/validate-vue'

const form = ref({
  username: '',
  email: '',
  age: '',
})

const { errors, isValid, isValidating, validate, reset, handleSubmit } = useFormValidation(
  form,
  {
    username: { label: '用户名', required: true, min: 3, max: 20 },
    email: { label: '邮箱', required: true, type: 'email' },
    age: { label: '年龄', type: 'number', min: 18, max: 120 },
  },
  { immediate: false },
)

function onSubmit() {
  handleSubmit(
    (data) => alert('提交成功: ' + JSON.stringify(data)),
    (errs) => console.log('校验失败', errs),
  )
}
</script>

<template>
  <div style="max-width: 480px; margin: 40px auto; font-family: sans-serif;">
    <h1>@ldesign/validate Playground</h1>

    <div style="margin-bottom: 16px;">
      <label>用户名</label>
      <input v-model="form.username" placeholder="3-20 个字符" style="display:block;width:100%;padding:8px;margin-top:4px;" />
      <span v-if="errors.username?.length" style="color:red;font-size:12px;">{{ errors.username[0] }}</span>
    </div>

    <div style="margin-bottom: 16px;">
      <label>邮箱</label>
      <input v-model="form.email" placeholder="your@email.com" style="display:block;width:100%;padding:8px;margin-top:4px;" />
      <span v-if="errors.email?.length" style="color:red;font-size:12px;">{{ errors.email[0] }}</span>
    </div>

    <div style="margin-bottom: 16px;">
      <label>年龄</label>
      <input v-model="form.age" type="number" placeholder=">=18" style="display:block;width:100%;padding:8px;margin-top:4px;" />
      <span v-if="errors.age?.length" style="color:red;font-size:12px;">{{ errors.age[0] }}</span>
    </div>

    <button @click="onSubmit" :disabled="isValidating" style="padding:8px 24px;margin-right:8px;">提交</button>
    <button @click="reset" style="padding:8px 24px;">重置</button>

    <p style="margin-top:16px;color:#888;">
      状态: {{ isValid ? '✅ 有效' : '❌ 无效' }} {{ isValidating ? '(校验中...)' : '' }}
    </p>
  </div>
</template>
