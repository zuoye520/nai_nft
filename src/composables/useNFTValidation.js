import { useForm } from 'vee-validate'
import { nftFormSchema } from '../validations/nftFormSchema'

export function useNFTValidation() {
  const { 
    handleSubmit, 
    values, 
    errors,
    validateField,
    setFieldValue,
    validate // 添加 validate 方法
  } = useForm({
    validationSchema: nftFormSchema,
    validateOnBlur: true,    // 失焦验证
    validateOnChange: true,  // 值变化时验证
    validateOnMount: false,   // 挂载时验证
    initialValues: {
      collectionName: null,
      nftCount: null,
      image: null,
      mintPrice: null,
      mintPercent: null,
      swapFee: null,
      buyFee: null,
      sellFee: null,
      description: null,
      social: {
        twitter: null,
        telegram: null,
        website: null
      }
    }
  })

  // 添加表单验证方法
  const validateForm = async () => {
    const result = await validate()
    return Object.keys(result.errors).length === 0
  }

  return {
    handleSubmit,
    values,
    errors,
    validateField,
    setFieldValue,
    validateForm // 导出 validateForm 方法
  }
}