#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{State, STATE};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:oracle";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    let state = &State {
        owner: info.sender.clone(),
        price: msg.price,
    };
    STATE.save(deps.storage, state)?;
    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("owner", info.sender.to_string())
        .add_attribute("price", state.price))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    //TODO: execute try_update_price
    Ok(Response::new())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::QueryPrice {} => {
            let state = STATE.load(deps.storage)?;
            to_binary(&state.as_query_price_response())
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::msg::QueryPriceResponse;

    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{from_binary, Uint128};

    #[test]
    fn test_instantiate() {
        let mut deps = mock_dependencies(&[]);

        let msg = InstantiateMsg {
            price: Uint128::from(17u32),
        };
        let info = mock_info("creator", &[]);

        // We can just call .unwrap() to assert this was a success
        let res = instantiate(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // After instantiation, let's query the state and confirm it
        // returns what we passed to Instantiate.
        let response = from_binary::<QueryPriceResponse>(
            &query(deps.as_ref(), mock_env(), QueryMsg::QueryPrice {}).unwrap(),
        )
        .unwrap();
        assert_eq!(Uint128::from(17u32), response.price);
    }

    #[test]
    fn test_update_price() {}
}
