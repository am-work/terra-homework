use cosmwasm_std::{Addr, Uint128};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub token_address: Addr,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // Buy
    Buy {},

    // Withdraw
    Withdraw { amount: u64 }, // Step 1: claim rewards from validators
    WithdrawStep2ConvertRewardsToLuna { amount: u64 },
    WithdrawStep3SendLuna { amount: u64 },

    // StartUndelegation
    StartUndelegation { amount: Uint128 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    QueryTokenAddress {},
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct QueryTokenAddressResponse {
    pub token_address: Addr,
}
