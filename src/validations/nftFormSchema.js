import * as yup from 'yup';

export const nftFormSchema = yup.object({
  collectionName: yup
    .string()
    .nullable()
    .default(null)// 设置默认值，避免初始验证
    .min(3, 'Collection name must be at least 3 characters')
    .max(20, 'Collection name must be less than 20 characters')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Collection name can only contain letters, numbers, and underscores'
    ), // 只允许字母、数字、下划线

  nftCount: yup
    .number()
    .nullable()
    .default(null) // 设置默认值，避免初始验证
    .min(100, 'Minimum 100 NFTs required')
    .max(10000, 'Maximum 10000 NFTs allowed'),


  image: yup
    .mixed()
    .nullable()
    .default(null)
    .test('fileSize', 'File size must be less than 10MB', value => {
      if (!value) return true; // 如果没有值返回 true 不触发验证
      return value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Only image files are allowed', value => {
      if (!value) return true; // 如果没有值返回 true 不触发验证
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
    }),

  mintPrice: yup
    .number()
    .nullable()
    .default(null) // 设置默认值，避免初始验证
    .min(1, 'Minimum mint price is 1 NULS'),

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
