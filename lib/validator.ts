import _ from "lodash";
import { ACCOUNT_ADDR, VALIDATOR_ADDR } from "./const";
import { ValidatorDetails } from "./staking";
import { ValidatorData } from "./types";
import { getValidators } from "./unchained"


export const getValidatorDetails = async (): Promise<ValidatorDetails> => {
    const validatorRank = await getValidatorWithRank()

    return {
        apr: validatorRank.apr,
        validatorAddress: VALIDATOR_ADDR,
        commission: 0.1,
        accountAddress: ACCOUNT_ADDR,
        rank: validatorRank.rank,
        votingPower: 0
    }
}

export const getValidatorWithRank = async () => {
    const allValidators = await getValidators()

    const validators: ValidatorData[] = allValidators.validators.map(x => {
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