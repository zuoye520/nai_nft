import * as yup from 'yup';

export const nftFormSchema = yup.object({
  collectionName: yup
    .string()
    .nullable()
    .min(1, 'Collection name must be at least 1 characters')
    .max(50, 'Collection name must be less than 50 characters')
    .default(null), // 设置默认值，避免初始验证
  
  nftCount: yup
    .number()
    .nullable()
    .default(null) // 设置默认值，避免初始验证
    .min(100, 'Minimum 100 NFTs required')
    .max(10000, 'Maximum 10000 NFTs allowed'),
    
  image: yup
    .mixed()
    .required('Image is required')
    .test('fileSize', 'File size must be less than 10MB', value => {
      if (!value) return false;
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value) return false;
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    }),
  
  mintPrice: yup
    .number()
    .nullable()
    .default(null) // 设置默认值，避免初始验证
    .min(10, 'Minimum mint price is 10 NULS'),
  
  mintPercent: yup
    .number()
    .nullable()
    .default(null) // 设置默认值，避免初始验证
    .min(60, 'Minimum mint percent is 60%')
    .max(80, 'Maximum mint percent is 80%'),
  
  swapFee: yup
    .number()
    .nullable()
    .default(null) // 设置默认值，避免初始验证
    .min(1, 'Minimum Swap fee is 1%')
    .max(50, 'Maximum Swap fee is 50%'),
  
  description: yup
    .string()
    .nullable()
    .max(1000, 'Description must be less than 1000 characters'),
  
  social: yup.object({
    twitter: yup
      .string()
      .nullable()
      .url('Must be a valid URL')
      .default(null),
    telegram: yup
      .string()
      .nullable()
      .url('Must be a valid URL')
      .default(null),
    website: yup
      .string()
      .nullable()
      .url('Must be a valid URL')
      .default(null),
  }),
});
