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
* **Kovan** 
  * **Develop**
    * https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-kovan-develop
    * https://thegraph.com/hosted-service/subgraph/mohammadranjbarz/giv-economy-kovan-develop
  * **Production**
    * https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-kovan
    * https://thegraph.com/hosted-service/subgraph/mohammadranjbarz/giv-economy-kovan

* **Xdai**
  * **Develop**
    * https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai-develop
    * https://thegraph.com/hosted-service/subgraph/mohammadranjbarz/giv-economy-xdai-develop
  * **Production**
    * https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai
    * https://thegraph.com/hosted-service/subgraph/mohammadranjbarz/giv-economy-xdai



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

* **Unipool contract info**

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

* **Get UniswapStakedPositions**
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
  }
}
```

* **Get UniswapV3Pools
 ```
 {
  uniswapV3Pools{
    id
    sqrtPriceX96
    tick
  }
 }
```

* Create and Update tokenAllocation flow

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBUW1Rva2VuIERpc3Ryb10gLS0-fGVtaXQgYWxsb2NhdGV8IEIoQmxvY2tjaGFpbilcbiAgICBEW0Rpc3RyaWJ1dG9yc10gLS0-fGVtaXQgcmV3YXJkUGFpZHwgQihCbG9ja2NoYWluKVxuICAgIFQgLS0-fGVtaXQgZ2l2YmFja1BhaWR8IEIoQmxvY2tjaGFpbilcbiAgICBCIC0tPiB8aW5kZXggZXZlbnR8IFNbU3ViZ3JhcGhdXG4gICAgUyAtLT58YWxsb2NhdGV8IENbY3JlYXRlIGFsbG9jYXRpb25dXG4gICAgUyAtLT58cmV3YXJkUGFpZHwgVURbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGRpc3RyaWJ1dG9yIG5hbWVdXG4gICAgUyAtLT58Z2l2YmFja1BhaWR8IFJbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGdpdmJhY2tdXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBUW1Rva2VuIERpc3Ryb10gLS0-fGVtaXQgYWxsb2NhdGV8IEIoQmxvY2tjaGFpbilcbiAgICBEW0Rpc3RyaWJ1dG9yc10gLS0-fGVtaXQgcmV3YXJkUGFpZHwgQihCbG9ja2NoYWluKVxuICAgIFQgLS0-fGVtaXQgZ2l2YmFja1BhaWR8IEIoQmxvY2tjaGFpbilcbiAgICBCIC0tPiB8aW5kZXggZXZlbnR8IFNbU3ViZ3JhcGhdXG4gICAgUyAtLT58YWxsb2NhdGV8IENbY3JlYXRlIGFsbG9jYXRpb25dXG4gICAgUyAtLT58cmV3YXJkUGFpZHwgVURbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGRpc3RyaWJ1dG9yIG5hbWVdXG4gICAgUyAtLT58Z2l2YmFja1BhaWR8IFJbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGdpdmJhY2tdXG4iLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGVmYXVsdFwiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)
