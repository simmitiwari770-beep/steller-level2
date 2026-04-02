#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol, token};

#[contracttype]
#[derive(Clone)]
pub struct Campaign {
    pub title: Symbol,
    pub goal_amount: i128,
    pub total_raised: i128,
    pub owner: Address,
    pub token: Address,
}

#[contract]
pub struct Crowdfunding;

#[contractimpl]
impl Crowdfunding {
    pub fn initialize(env: Env, title: Symbol, goal_amount: i128, owner: Address, token: Address) {
        if env.storage().instance().has(&symbol_short!("CAMPAIGN")) {
            panic!("Already initialized");
        }
        let campaign = Campaign {
            title,
            goal_amount,
            total_raised: 0,
            owner,
            token,
        };
        env.storage().instance().set(&symbol_short!("CAMPAIGN"), &campaign);
    }

    pub fn donate(env: Env, donor: Address, amount: i128) {
        donor.require_auth();
        
        let mut campaign: Campaign = env.storage().instance().get(&symbol_short!("CAMPAIGN")).expect("Not initialized");
        
        // Transfer funds from donor to the contract itself
        let token_client = token::Client::new(&env, &campaign.token);
        token_client.transfer(&donor, &env.current_contract_address(), &amount);
        
        // Update stats
        campaign.total_raised += amount;
        env.storage().instance().set(&symbol_short!("CAMPAIGN"), &campaign);
        
        // Emit event
        env.events().publish(
            (symbol_short!("donate"), donor),
            amount
        );
    }

    pub fn get_campaign(env: Env) -> Campaign {
        env.storage().instance().get(&symbol_short!("CAMPAIGN")).expect("Not initialized")
    }
}
