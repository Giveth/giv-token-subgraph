## Query Samples
It's not completed for sure

### **Token Allocation**
```
{
  tokenAllocations(first: 10) {
    id
    recipient
    amount
    timestamp
    distributor
    txHash
    givback
  }
}
```

```
{
  tokenAllocations( where:{
    recipient: "0xf23ea0b5f14afcbe532a1df273f7b233ebe41c78"
  }) {
    id
    recipient
    amount
    timestamp
    distributor
    txHash
    givback
  }
}
```

### **GIV Balance**

```
{
  balances( first: 10 ) {
    balance
    allocatedTokens
    claimed
    rewardPerTokenPaidGivLm
    rewardsGivLm
    rewardPerTokenPaidSushiSwap
    rewardsSushiSwap
    rewardPerTokenPaidHoneyswap
    rewardsHoneyswap
    rewardPerTokenPaidUniswap
    rewardsUniswap
    rewardPerTokenPaidBalancer
    rewardsBalancer
    givback
    balancerLp
    balancerLpStaked
    sushiswapLp
    sushiSwapLpStaked
    honeyswapLp 
    honeyswapLpStaked 
    givStaked
    givDropClaimed
  }
}
```

```
{
  tokenAllocations(first: 5,
    skip:0
    orderBy:timestamp,
    orderDirection:asc,
    where:{
      recipient:"0x8f48094a12c8f99d616ae8f3305d5ec73cbaa6b6"
    }
  ) {
    id
    recipient
    amount
    timestamp
  }
}
```

### **Unipool contract info**

```
{
     unipoolContractInfos{
          id
          periodFinish
          totalSupply
          rewardRate
          lastUpdateTime
          rewardPerTokenStored
     }
}

```

### **Token distro smart contract info**
```
{
  tokenDistroContractInfos(first:5){
    id
    initialAmount
    duration
    startTime
    cliffTime
    lockedAmount
    totalTokens
  }
}
```

### **Get Giv price**
```
{
  prices{
    id
    from
     to
    value
    source
    blockTimeStamp
  }
}
```

### **Get UniswapStakedPositions**
```
{
  uniswapPositions{
    id
    tokenId
    staked
    liquidity
    tickLower
    tickUpper
    owner
    staker
    closed
  }
}
```

### **Get UniswapV3Pools
 ```
 {
  uniswapV3Pools{
    id
    sqrtPriceX96
    tick
  }
 }
```
