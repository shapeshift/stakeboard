import Redis from "ioredis";
import _ from "lodash";
import { ACCOUNT_ADDR, VALIDATORS, VALIDATOR_ADDR } from "./const";
import { ValidatorDetails } from "./staking";
import { uAtomToAtom } from "./tx/util";
import { ValidatorData, ValidatorEntry } from "./types";


export const getValidatorDetails = async (redis: Redis): Promise<ValidatorDetails> => {
    const allValidators: ValidatorEntry[] = await loadValidators(redis)
    const validatorRank = await getValidatorWithRank(allValidators)
    const totalShares = _.sum(allValidators.map(x => Number(x.shares)))
    const votingPower = validatorRank.shares/totalShares

    return {
        apr: validatorRank.apr,
        validatorAddress: VALIDATOR_ADDR,
        commission: 0.1,
        accountAddress: ACCOUNT_ADDR,
        rank: validatorRank.rank,
        votingPower: votingPower,
        totalDelegated: uAtomToAtom(totalShares),
        shapeshiftDelegated: uAtomToAtom(validatorRank.shares)
    }
}

export const getValidatorWithRank = async (allValidators: ValidatorEntry[]) => {
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

