Thegraph link: You can go here https://graphiql-online.com/graphiql

use this link https://api.thegraph.com/subgraphs/name/mohammadranjbarz/gardenunipool

query sample:
```
{
  distributions(first: 5) {
    id
    source
    address
    amount
  }
}
```