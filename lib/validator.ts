import _ from "lodash";
import { VALIDATOR_ADDR } from "./const";
import { ValidatorData } from "./types";
import { getValidators } from "./unchained"

export const getValidatorRank = async () => {
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