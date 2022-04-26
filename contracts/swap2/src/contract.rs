#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    Binary, Deps, DepsMut,
    Empty, Env, MessageInfo, Response, StdError, StdResult, SubMsg, Uint128,
};
use cw0::must_pay;
use cw2::set_contract_version;
//use cw20::Cw20ExecuteMsg;

use terra_cosmwasm::{ExchangeRatesResponse, TerraMsgWrapper, TerraQuerier};

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};

// use oracle::contract::query_price;
// use oracle::msg::PriceResponse;

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:swap2";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

// BlockNgine - 0% comission on testnet
const _VALIDATOR: &str = "terravaloper1ze5dxzs4zcm60tg48m9unp8eh7maerma38dl84";

// StakeBin - 1% comission on testnet
// https://finder.terra.money/testnet/validator/terravaloper19ne0aqltndwxl0n32zyuglp2z8mm3nu0gxpfaw
// const VALIDATOR: &str = "terravaloper19ne0aqltndwxl0n32zyuglp2z8mm3nu0gxpfaw";

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    // TODO
    Ok(Response::new())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(_deps: Deps, _env: Env, _msg: QueryMsg) -> StdResult<Binary> {
    // TODO
    Err(StdError::generic_err("not implemented"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: Empty) -> Result<Response, ContractError> {
    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: ExecuteMsg,
) -> Result<Response<TerraMsgWrapper>, ContractError> {
    // TODO
    Err(ContractError::NotImplemented {})
}

pub fn try_buy(
    _deps: DepsMut,
    _env: Env,
    info: MessageInfo,
) -> Result<Response<TerraMsgWrapper>, ContractError> {
    let _payment_amt =
        must_pay(&info, "uluna").map_err(|error| StdError::generic_err(format!("{}", error)))?;

    // TODO
    Ok(Response::<TerraMsgWrapper>::new())
}

pub fn try_withdraw_step1_collect_rewards(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    _amount: u64,
) -> Result<Response<TerraMsgWrapper>, ContractError> {
    // Step 1: Collect all rewards we have accrued.

    let _reward_submessages = collect_all_rewards(deps, &env)?;

    // TODO
    Ok(Response::<TerraMsgWrapper>::new())
}

pub fn collect_all_rewards(
    _deps: DepsMut,
    _env: &Env,
) -> Result<Vec<SubMsg<TerraMsgWrapper>>, ContractError> {
    // TODO
    Err(ContractError::NotImplemented {})
}

pub fn try_withdraw_step2_convert_all_native_coins_to_luna(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _amount: u64,
) -> Result<Response<TerraMsgWrapper>, ContractError> {
    // TODO
    Err(ContractError::NotImplemented {})
}

pub fn try_withdraw_step3_send_luna(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _amount: u64,
) -> Result<Response<TerraMsgWrapper>, ContractError> {
    // TODO
    Err(ContractError::NotImplemented {})
}

pub fn try_start_undelegation(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _amount: Uint128,
) -> Result<Response<TerraMsgWrapper>, ContractError> {
    // TODO
    Err(ContractError::NotImplemented {})
}

pub fn query_exchange_rates(
    deps: &DepsMut,
    base_denom: String,
    quote_denoms: Vec<String>,
) -> StdResult<ExchangeRatesResponse> {
    let querier = TerraQuerier::new(&deps.querier);
    let res: ExchangeRatesResponse = querier.query_exchange_rates(base_denom, quote_denoms)?;
    Ok(res)
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coins, Addr};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies(&[]);

        let msg = InstantiateMsg {
            token_address: Addr::unchecked("terra1hpajld8zs93md8zrs6sfy42zl0khqpmr07muw0"),
        };
        let info = mock_info("creator", &coins(10000000000, "uluna"));

        // we can just call .unwrap() to assert this was a success
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // it worked, let's query the state
        let res = query(deps.as_ref(), mock_env(), QueryMsg::QueryTokenAddress {});
        assert_eq!(res, Err(StdError::generic_err("not implemented")));

        // let value: QueryTokenAddressResponse = from_binary(&res).unwrap();
        // assert_eq!(
        //     "terra1hpajld8zs93md8zrs6sfy42zl0khqpmr07muw0",
        //     value.token_address
        // );
    }
}
