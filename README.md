## Installation
### Clone
* `git clone `

### Build
* `yarn`
* `yarn codegen:xdai`
* `yarn codegen:kovan`
* `yarn codegen:mainnet`
* `yarn build:xdai`
* `yarn build:kovan`
* `yarn build:mainnet`

### Deploy
* `graph auth`
* Change address of subgraphs in package.json >> scripts >> deploy:kovan & deploy:xdai 
(You should first go to https://thegraph.com/hosted-service and create subgraphs from panel)
* Deploy **xdai**: `yarn deploy:xdai`
* Deploy **kovan**: `yarn deploy:kovan`

## Smart contracts
You can see the smart contracts here
https://www.notion.so/giveth/Testing-Deployment-218c3f503a04421ba3f51e438f4d6acf

## Get subgraphs info
* **URL**: https://api.thegraph.com/index-node/graphql
* Query sample
```
query{
  indexingStatusForCurrentVersion(subgraphName: "giveth/giveth-economy-mainnet"){
    subgraph
    synced
    health
    entityCount
    node
  }
}
```

## Add Regen farm steps (like foxHoney, cultEth, ..):
* In balance schema you need to add some fields, for instance for **CULT/ETH** farm we added these
  * `cultClaimed`
  * `cultAllocatedTokens`
  * `cultEthLpStaked`
  * `cultEthLp`
  * `rewardPerTokenPaidCultEthLm`
  * `rewardsCultEthLm`
* Add some constant variables in ./src/helpers/constants, for instance for **CULT/ETH**
  * `CULT_TOKEN_DISTRO`
  * `CULT_ETH_LP`
  * `CULT_ETH_LM`
* Add Lm mapping file
* Add lm smart contract info in subgraph.(xdai | xdai.develop | kovan | mainnet).yaml
* Add lp mapping file
* Add lp smart contract info in subgraph.(xdai | xdai.develop | kovan | mainnet).yaml
* Add token distro mapping file
* Add token distro contract info in subgraph.(xdai | xdai.develop | kovan | mainnet).yaml
* Update all functions in src/commons/balanceHandler.ts to support new TokenDistro contract, and LP and LM tokens.

**PS** You can check https://github.com/Giveth/giv-token-subgraph/pull/53 to see a real example

## Test
Online graphql client link: You can go here https://graphiql-online.com/graphiql

### Staging
  * https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-kovan-staging
  * https://thegraph.com/hosted-service/subgraph/giveth/giveth-economy-kovan-staging
  * https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-xdai-staging
  * https://thegraph.com/hosted-service/subgraph/giveth/giveth-economy-xdai-staging
### Production
  * https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-mainnet
  * https://thegraph.com/hosted-service/subgraph/giveth/giveth-economy-mainnet
  * https://api.thegraph.com/subgraphs/name/giveth/giveth-economy-xdai
  * https://thegraph.com/hosted-service/subgraph/giveth/giveth-economy-xdai


## Query sample
You can see it [here](./docs/querySamples.md)
## Smart contract infos
* [UnipoolTokenDistributor](./docs/unipoolTokenDistributor.md)

* Create and Update tokenAllocation flow

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICBUW1Rva2VuIERpc3Ryb10gLS0-fGVtaXQgYWxsb2NhdGV8IEIoQmxvY2tjaGFpbilcbiAgICBEW0Rpc3RyaWJ1dG9yc10gLS0-fGVtaXQgcmV3YXJkUGFpZHwgQihCbG9ja2NoYWluKVxuICAgIFQgLS0-fGVtaXQgZ2l2YmFja1BhaWR8IEIoQmxvY2tjaGFpbilcbiAgICBCIC0tPiB8aW5kZXggZXZlbnR8IFNbU3ViZ3JhcGhdXG4gICAgUyAtLT58YWxsb2NhdGV8IENbY3JlYXRlIGFsbG9jYXRpb25dXG4gICAgUyAtLT58cmV3YXJkUGFpZHwgVURbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGRpc3RyaWJ1dG9yIG5hbWVdXG4gICAgUyAtLT58Z2l2YmFja1BhaWR8IFJbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGdpdmJhY2tdXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/edit#eyJjb2RlIjoiZ3JhcGggVERcbiAgICBUW1Rva2VuIERpc3Ryb10gLS0-fGVtaXQgYWxsb2NhdGV8IEIoQmxvY2tjaGFpbilcbiAgICBEW0Rpc3RyaWJ1dG9yc10gLS0-fGVtaXQgcmV3YXJkUGFpZHwgQihCbG9ja2NoYWluKVxuICAgIFQgLS0-fGVtaXQgZ2l2YmFja1BhaWR8IEIoQmxvY2tjaGFpbilcbiAgICBCIC0tPiB8aW5kZXggZXZlbnR8IFNbU3ViZ3JhcGhdXG4gICAgUyAtLT58YWxsb2NhdGV8IENbY3JlYXRlIGFsbG9jYXRpb25dXG4gICAgUyAtLT58cmV3YXJkUGFpZHwgVURbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGRpc3RyaWJ1dG9yIG5hbWVdXG4gICAgUyAtLT58Z2l2YmFja1BhaWR8IFJbVXBkYXRlIGFsbG9jYXRpb24ncyBkaXN0cml1YnRvciBvZiB0aGlzIHRyYW5zYWN0aW9uIHRvIGdpdmJhY2tdXG4iLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGVmYXVsdFwiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)
