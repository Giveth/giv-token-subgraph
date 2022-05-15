import {
  OwnershipTransferred,
  RewardAdded,
  RewardPaid,
  Staked,
  Withdrawn,
} from '../../generated/UniswapV2GivDaiLiquidityMiningTokenDistributor/UnipoolTokenDistributor';
import {
  createUnipoolContractInfoIfNotExists,
  onRewardAdded,
  OnRewardAddedParams,
  onRewardPaid,
  onStaked,
  OnStakedParams,
  onWithdrawn,
  OnWithdrawnParams,
} from '../commons/unipoolTokenDistributorHandler';
import { UNISWAP_V2_GIV_DAI_LM } from '../helpers/constants';

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  createUnipoolContractInfoIfNotExists(event.address);
}

export function handleRewardAdded(event: RewardAdded): void {
  onRewardAdded(event.address);
}

export function handleRewardPaid(event: RewardPaid): void {
  onRewardPaid(
    new OnRewardAddedParams(
      event.address,
      UNISWAP_V2_GIV_DAI_LM,
      event.params.user.toHex(),
      event.transaction.hash.toHex()
    )
  );
}

export function handleStaked(event: Staked): void {
  onStaked(new OnStakedParams(event.address, UNISWAP_V2_GIV_DAI_LM, event.params.user.toHex(), event.params.amount));
}

export function handleWithdrawn(event: Withdrawn): void {
  onWithdrawn(
    new OnWithdrawnParams(event.address, UNISWAP_V2_GIV_DAI_LM, event.params.user.toHex(), event.params.amount)
  );
}
