import Redis from "ioredis";
import _ from "lodash";
import { ACCOUNT_ADDR, VALIDATORS, VALIDATOR_ADDR } from "./const";
import { ValidatorDetails } from "./staking";
import { ValidatorData, ValidatorEntry } from "./types";


export const getValidatorDetails = async (redis: Redis): Promise<ValidatorDetails> => {
    const validatorRank = await getValidatorWithRank(redis)

    return {
        apr: validatorRank.apr,
        validatorAddress: VALIDATOR_ADDR,
        commission: 0.1,
        accountAddress: ACCOUNT_ADDR,
        rank: validatorRank.rank,
        votingPower: 0
    }
}

export const getValidatorWithRank = async (redis: Redis) => {
    const allValidators = await loadValidators(redis)

    const validators: ValidatorData[] = allValidators.map(x => {
        return {
            address: x.address,
            apr: parseFloat(x.apr),
            shares: parseFloat(x.shares),
            rank: 0
        }
    })

    const sortedValidators =_.chain(validators).sortBy(x => x.shares).reverse().value()

    // I can't find a better way to do this in JS ;/ zipWithIndex would be nice to have
    const indexedValidators = sortedValidators.map(x => {
        x.rank = _.findIndex(sortedValidators, q => q.address == x.address)+1
        return x
    })

    const shapeshiftValidator = indexedValidators.find(x => x.address === VALIDATOR_ADDR) 
    return shapeshiftValidator;
}

const loadValidators = async (redis: Redis): Promise<ValidatorEntry[]> => {
    return (await redis.lrange(VALIDATORS, 0, -1)).map((x) => JSON.parse(x))
}

