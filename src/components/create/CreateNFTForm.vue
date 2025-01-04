<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Basic Info Section -->
    <BasicInfoSection
      :values="values"
      :errors="errors"
      @update:field="handleFieldUpdate"
      @blur="handleBlur"
    />

    <!-- Fees Section -->
    <FeesSection
      :values="values"
      :errors="errors"
      @update:field="handleFieldUpdate"
      @blur="handleBlur"
    />

    <!-- Description Section -->
    <DescriptionSection
      :values="values"
      :errors="errors"
      @update:field="handleFieldUpdate"
      @blur="handleBlur"
    />

    <!-- Social Links Section -->
    <div class="pt-4">
      <button
        type="button"
        class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
        @click="showSocial = !showSocial"
      >
      <ChevronRightIcon
          class="w-5 h-5 transition-transform"
          :class="{ 'rotate-90': showSocial }"
        />
        Show more options
      </button>

      <SocialLinksSection
        v-show="showSocial"
        :values="values"
        :errors="errors"
        @update:field="handleFieldUpdate"
        @blur="handleBlur"
      />
    </div>

    <!-- Submit Button -->
    <div class="pt-6">
      <BaseButton type="submit" primary class="w-full">
        Create Collection
      </BaseButton>
    </div>

    <!-- Gas Fee Notice -->
    <GasFeeNotice />
  </form>
</template>

<script setup>
import { useWalletStore } from '../../stores/wallet'
import { storeToRefs } from 'pinia'
const walletStore = useWalletStore()
const { account, currentChainConfig, primaryDomain,primaryDomainOmit, userUri } = storeToRefs(walletStore)
import { ref,getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
import { useRouter } from "vue-router";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";
import BaseButton from "../BaseButton.vue";
import BasicInfoSection from "./sections/BasicInfoSection.vue";
import FeesSection from "./sections/FeesSection.vue";
import DescriptionSection from "./sections/DescriptionSection.vue";
import SocialLinksSection from "./sections/SocialLinksSection.vue";
import GasFeeNotice from "./notices/GasFeeNotice.vue";
import { useNFTValidation } from "../../composables/useNFTValidation";

const router = useRouter();
const showSocial = ref(false);

const { handleSubmit, values, errors, validateField, setFieldValue } =
  useNFTValidation();

const handleFieldUpdate = async (field, value) => {
  
  setFieldValue(field, value);
};

const handleBlur = (field) => {
  validateField(field);
};

const onSubmit = handleSubmit(async (values) => {
  try {
    //上传图片
    // const result = await walletStore.uploadFile(values.image)
    // console.log('uploadFile result:', result)
    // const uri = `https://${proxy.$config.IPFS_CONFIG.gateway}/ipfs/${result.IpfsHash}`
    const IpfsHash = "bafkreic37lk6gleexx3qbt42dgn2clyjgk7o6y32fndgaldqhsmu5ippqe"
    const extendUri = ""
    console.log("Form submitted:", values);
    const data = {
      from: account.value,
      value: 10,//部署费用
      contractAddress: currentChainConfig.value.contracts.mainAddress,
      methodName: "createToken",
      args: [
        IpfsHash,//uri
        extendUri,//扩展uri 存取扩展数据
        values.collectionName,//name
        values.collectionName,//symbol
        currentChainConfig.value.payAsset,//支付资产
        proxy.$format.toAmount(values.mintPrice),//mint价格 加精度
        values.nftCount,//最大供应数量
        1,//是否开启老虎机，默认开启 1/0
        values.mintPercent * 100,//mint阶段进度 
        values.swapFee * 100 //swap手续费
      ]
    }
    console.log('createToken data:',data)
    const result = await walletStore.contractCall(data)
    console.log('createToken result:',result)
    //成功跳转首页
    router.push("/");
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});


</script>