## Installation
### Clone
* `git clone `

### Build
* `yarn`
* `yarn codegen:xdai`
* `yarn codegen:kovan`
* `yarn build:xdai`
* `yarn build:kovan`

### Deploy
* `graph auth`
* Change address of subgraphs in package.json >> scripts >> deploy:kovan & deploy:xdai 
(You should first go to https://thegraph.com/hosted-service and create subgraphs from panel)
* Deploy **xdai**: `yarn deploy:xdai`
* Deploy **kovan**: `yarn deploy:kovan`

## Smart contracts
You can see the smart contracts here
https://www.notion.so/giveth/Testing-Deployment-218c3f503a04421ba3f51e438f4d6acf

## Test
Online graphql client link: You can go here https://graphiql-online.com/graphiql

Our subgraphs: 
* **Kovan** : https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-kovan
* **Xdai**: https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai


Query sample:

* **Token Allocation**
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

* **GIV Balance**

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

* **Unipool contract info**

```
{
     unipoolContractInfos{
          id
          periodFinish
          rewardRate
          lastUpdateTime
          rewardPerTokenStored
     }
}

```

* **Token distro smart contract info**
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

* **Get Giv price**
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
