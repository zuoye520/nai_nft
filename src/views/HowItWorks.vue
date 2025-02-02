<template>
    <div class="min-h-screen py-12 bg-black">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="text-center mb-16">
          <h1 class="text-4xl font-bold text-white mb-6">How It Works</h1>
          <p class="text-xl text-gray-300 leading-relaxed">
            <!-- naiNFT — the world's first NFT + DEFI liquidity protocol, transforms NFT transactions from the traditional floor price model to a simpler Swap model, and continuously injects liquidity into NFT through NULS consensus node income, so that liquidity is inexhaustible. -->
            naiNFT — the world’s first NFT liquidity protocol combined with AI Agent. 
          </p>
          <p class="text-xl text-gray-300 leading-relaxed">It redefines NFT transactions by shifting from the traditional floor price model to a streamlined Swap model. By leveraging NULS staking rewards, it provides a continuous injection of liquidity, ensuring an inexhaustible and sustainable ecosystem for NFTs.</p>
        </div>
  
        <!-- For Deployers Section -->
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6">For Deployers</h2>
          <div class="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <p class="text-gray-300 mb-6">
              Deploy your NFT collection with one click, set your Mint price to about 10 times the target price, because Mint income will be distributed according to the following proportions:
            </p>
            
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl font-bold text-green-400">1</span>
                </div>
                <div class="flex-1">
                  <p class="text-gray-300">75% of the Mint income (NULS) will be randomly paid to users through the slot machine model.</p>
                </div>
              </div>
  
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl font-bold text-green-400">2</span>
                </div>
                <div class="flex-1">
                  <p class="text-gray-300">20% of the Mint income (NULS) and the remaining unminted NFTs will be used in the platform Bonding Curve + AMM model to create liquidity for Swap transactions and be permanently locked.</p>
                </div>
              </div>
  
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl font-bold text-green-400">3</span>
                </div>
                <div class="flex-1">
                  <p class="text-gray-300">5% of the Mint income (NULS) will enter the platform treasury for daily operations and distribution to inviters (50% of the income entering the treasury will be distributed to inviters).</p>
                </div>
              </div>
  
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl font-bold text-green-400">4</span>
                </div>
                <div class="flex-1">
                  <p class="text-gray-300">After the Mint phase, 50% of the Swap transaction fee income will be distributed to the deployer.</p>
                </div>
              </div>
  
              <!-- <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl font-bold text-green-400">5</span>
                </div>
                <div class="flex-1">
                  <p class="text-gray-300">After the Mint phase, 30% of the Swap transaction fee income will be distributed to the deployer.</p>
                </div>
              </div> -->
            </div>
          </div>
        </div>
  
        <!-- For Users Section -->
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6">For Users</h2>
          
          <div class="bg-gray-900/50 rounded-xl p-8 border border-gray-800">

            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span class="text-xl font-bold text-green-400">1</span>
              </div>
              <div class="flex-1">
                <p class="text-gray-300">During the Mint phase, you can directly Mint your favorite NFTs and have a 100% chance to win the slot lucky bonus. </p>
              </div>
            </div>

            <div class="flex items-start gap-4 mt-6">
              <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span class="text-xl font-bold text-green-400">2</span>
              </div>
              <div class="flex-1">
                <p class="text-gray-300">After the Mint phase, you can trade NFTs on the Swap page. If the transaction fee is 10% or higher, each transaction will also give you a chance to win the slot lucky bonus. </p>
              </div>
            </div>
            <!-- <div class="flex items-start gap-4 mt-6">
              <div class="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span class="text-xl font-bold text-green-400">3</span>
              </div>
              <div class="flex-1">
                <p class="text-gray-300">After the Mint phase, 50% of the Swap transaction fee income will be distributed to the deployer.</p>
              </div>
            </div> -->
            <p class="mt-6"><strong>Lucky Bonus Rules:</strong></p>
            <p class="mt-2">
              Mint/Swap NFT randomly allocates slot pool balances from 0 to 100%, which means you can get 100x reward of Mint/Swap fees.
            </p>
          </div>
        </div>

        <!-- For Users Section -->
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6">For the inviter</h2>
          <div class="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <p class="text-gray-300">   
                When your friends mint or trade NFTs, you will be rewarded and you will share 50% of the platform revenue as a reward.
            </p>
          </div>
        </div>
        <!-- For Airdrop -->
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-white mb-6">Airdrop</h2>
          <div class="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <p class="text-gray-300">   
              Coming Soon
            </p>
          </div>
        </div>
        <!-- For Economic Model -->
        <div>
          <h2 class="text-2xl font-bold text-white mb-6">Economic Model</h2>
          <div class="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
            <p class="text-gray-300">   
              Coming Soon
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>