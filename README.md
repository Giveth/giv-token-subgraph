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
* Deploy xdai: `yarn deploy:xdai`
* Deploy kovan: `yarn deploy:kovan`

## Smart contracts
You can see the smart contracts here
https://www.notion.so/giveth/Testing-Deployment-218c3f503a04421ba3f51e438f4d6acf

## Test
Online graphql client link: You can go here https://graphiql-online.com/graphiql

Our subgraphs: 
* Kovan : https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-kovan
* Xdai: https://api.thegraph.com/subgraphs/name/mohammadranjbarz/giv-economy-xdai


query sample:

```
{
  tokenAllocations(first: 10) {
    id
    recipient
    amount
    timestamp
    distributor
    txHash
  }
}
```