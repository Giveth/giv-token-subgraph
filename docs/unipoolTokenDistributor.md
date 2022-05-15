## Unipool Token distributor info
We need to update some fields of  [UnipoolTokenDistributor.sol](https://github.com/Giveth/giv-token-contracts/tree/develop/contracts/Distributors) for calculating APR
So we need to know when every field changes so gathered below info from reading the above smart contract 


| variable             | functions that change it                              | events that will be emit after changing that |
|----------------------|-------------------------------------------------------|----------------------------------------------|
| rewardPerTokenStored | updateReward, rewardPerToken, earned, getReward, exit | RewardAdded, Staked, Withdrawn, RewardPaid   |
| periodFinish         | notifyRewardAmount                                    | RewardAdded                                  |
| totalSupply          | stake, withdraw                                       | Withdrawn, Staked                            |
| rewardRate           | notifyRewardAmount                                    | RewardAdded                                  |
| lastUpdateTime       | notifyRewardAmount, updateReward                      | RewardAdded, Staked, Withdrawn, RewardPaid   |
