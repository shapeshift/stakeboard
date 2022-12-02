export interface ValidatorResponse {
    validators: ValidatorEntry[]
}

export interface ValidatorEntry {
    address: string
    apr: string
    shares: string
}

export interface ValidatorData {
    address: string
    apr: number
    shares: number
    rank: number
}

export interface CosmosTxResponse {
    pubkey: string;
    cursor: string;
    txs:    Tx[];
}

export interface Tx {
    txid:          string;
    blockHash:     string;
    blockHeight:   number;
    timestamp:     number;
    confirmations: number;
    fee:           Fee;
    gasUsed:       string;
    gasWanted:     string;
    index:         number;
    value:         string;
    memo:          string;
    messages:      MessageElement[];
    events:        { [key: string]: Event };
}

export interface Event {
    coin_received:        CoinReceived;
    coin_spent:           CoinSpent;
    message:              EventMessage;
    transfer:             Transfer;
    withdraw_rewards?:    WithdrawRewards;
    withdraw_commission?: WithdrawCommission;
}

export interface CoinReceived {
    amount:   string;
    receiver: string;
}

export interface CoinSpent {
    amount:  string;
    spender: string;
}

export interface EventMessage {
    action: string;
    module: Module;
    sender: string;
}

export enum Module {
    Distribution = "distribution",
}

export interface Transfer {
    amount:    string;
    recipient: string;
    sender:    string;
}

export interface WithdrawCommission {
    amount: string;
}

export interface WithdrawRewards {
    amount:    string;
    validator: string;
}

export interface Fee {
    amount: string;
    denom:  Denom;
}

export enum Denom {
    Uatom = "uatom",
}

export interface MessageElement {
    origin: string;
    from:   string;
    to:     string;
    type:   string;
    value:  Fee;
}

export enum Type {
    WithdrawDelegatorReward = "withdraw_delegator_reward",
}