use crate::msg::GetPriceResponse;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::Item;

pub const STATE: Item<State> = Item::new("state");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct State {
    /// Address of owner (allowed to write new prices to this contract).
    pub owner: Addr,
    /// Price of a uLemon in uLunas.
    pub price: Uint128,
}

impl State {
    /// Convert State to QueryPriceResponse.
    pub fn as_get_price_response(&self) -> GetPriceResponse {
        GetPriceResponse { price: self.price }
    }
}
