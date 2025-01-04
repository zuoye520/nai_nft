import { useForm } from 'vee-validate'
import { nftFormSchema } from '../validations/nftFormSchema'

export function useNFTValidation() {
  const { 
    handleSubmit, 
    values, 
    errors,
    validateField,
    setFieldValue 
  } = useForm({
    validationSchema: nftFormSchema,
    validateOnBlur: true,    // 失焦验证
    validateOnChange: true,  // 值变化时验证
    validateOnMount: false,   // 挂载时验证
    initialValues: {
      collectionName: '',
      nftCount: '',
      image: null,
      mintPrice: '',
      mintPercent: '',
      swapFee:'',
      buyFee: '',
      sellFee: '',
      description: '',
      social: {
        twitter: '',
        telegram: '',
        website: ''
      }
    }
  })

  return {
    handleSubmit,
    values,
    errors,
    validateField,
    setFieldValue
  }
}