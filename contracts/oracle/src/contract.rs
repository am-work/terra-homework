#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128,
};
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
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::UpdatePrice { price } => update_price(deps, info, price),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetPrice {} => {
            let state = STATE.load(deps.storage)?;
            to_binary(&state.as_get_price_response())
        }
    }
}

/// update_prices validates that the caller is authorized and then saves the new
/// price in storage.
fn update_price(
    deps: DepsMut,
    info: MessageInfo,
    new_price: Uint128,
) -> Result<Response, ContractError> {
    let mut state = STATE.load(deps.storage)?;
    // Only owner is allowed to call this contract.
    if info.sender != state.owner {
        return Err(ContractError::Unauthorized {});
    }
    state.price = new_price;
    STATE.save(deps.storage, &state)?;
    Ok(Response::new()
        .add_attribute("action", "update_price")
        .add_attribute("new_price", new_price.to_string()))
}

#[cfg(test)]
mod tests {
    use crate::msg::GetPriceResponse;

    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{attr, from_binary, Uint128};

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
        let response = from_binary::<GetPriceResponse>(
            &query(deps.as_ref(), mock_env(), QueryMsg::GetPrice {}).unwrap(),
        )
        .unwrap();
        assert_eq!(Uint128::from(17u32), response.price);
    }

    #[test]
    fn test_update_price() {
        let mut deps = mock_dependencies(&[]);
        let msg = InstantiateMsg {
            price: Uint128::from(17u32),
        };
        let info = mock_info("creator", &[]);
        instantiate(deps.as_mut(), mock_env(), info.clone(), msg).unwrap();

        // Random attacker cannot update price.
        let attacker = mock_info("mallory", &[]);
        let msg = ExecuteMsg::UpdatePrice {
            price: Uint128::from(666u32),
        };
        let err = execute(deps.as_mut(), mock_env(), attacker, msg.clone()).unwrap_err();
        assert_eq!(err, ContractError::Unauthorized {});

        // Owner is allowed to update price.
        let response = execute(deps.as_mut(), mock_env(), info, msg).unwrap();
        assert_eq!(
            response,
            Response::new().add_attributes(vec![
                attr("action", "update_price"),
                attr("new_price", "666")
            ])
        );

        // Querying price after a successful update should return the new price.
        let response = from_binary::<GetPriceResponse>(
            &query(deps.as_ref(), mock_env(), QueryMsg::GetPrice {}).unwrap(),
        )
        .unwrap();
        assert_eq!(response, GetPriceResponse{ price: Uint128::from(666u32)});
    }
}
