import * as yup from 'yup'

export const nftFormSchema = yup.object({
  collectionName: yup
    .string()
    .required('Collection name is required')
    .min(1, 'Collection name must be at least 3 characters')
    .max(50, 'Collection name must be less than 50 characters'),
  
  nftCount: yup
    .number()
    .required('Number of NFTs is required')
    .min(100, 'Minimum 100 NFTs required')
    .max(10000, 'Maximum 1000 NFTs allowed'),
  
  image: yup
    .mixed()
    .required('Image is required')
    .test('fileSize', 'File size must be less than 10MB', value => {
      if (!value) return true
      return value.size <= 10 * 1024 * 1024
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value) return true
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)
    }),
  
  mintPrice: yup
    .number()
    .required('Mint price is required')
    .min(10, 'Minimum mint price is 10 NULS')
    .typeError('Mint price must be a number'),
  
  mintPercent: yup
    .number()
    .required('Mint percent is required')
    .min(60, 'Minimum mint percent is 60%')
    .max(80, 'Maximum mint percent is 80%')
    .typeError('Mint percent must be a number'),
  
  buyFee: yup
    .number()
    .required('Buy fee is required')
    .min(1, 'Minimum buy fee is 1%')
    .max(50, 'Maximum buy fee is 50%')
    .typeError('Buy fee must be a number'),
  
  sellFee: yup
    .number()
    .required('Sell fee is required')
    .min(1, 'Minimum sell fee is 1%')
    .max(50, 'Maximum sell fee is 50%')
    .typeError('Sell fee must be a number'),
  
  description: yup
    .string()
    .max(1000, 'Description must be less than 1000 characters'),
  
  social: yup.object({
    twitter: yup
      .string()
      .url('Must be a valid URL')
      .nullable(),
    telegram: yup
      .string()
      .url('Must be a valid URL')
      .nullable(),
    website: yup
      .string()
      .url('Must be a valid URL')
      .nullable()
  })
})