import { Redis } from 'ioredis'
import { VALIDATORS } from '../const'
import { getValidators } from '../unchained'

export const runValidatorSync = async (redis: Redis) => {

    let completed = false
    let cursor = ""
    let allValidators = []

    while(!completed){
        const validatorResp = await getValidators(cursor)
        allValidators = [...allValidators, ...validatorResp.validators]
        if(validatorResp.cursor === undefined){
            completed = true
        }else{
            cursor = validatorResp.cursor
        }
    }

    console.log(`Validators size: ${allValidators.length}`)

    // replace validator collection
    await redis.del(VALIDATORS)
    await redis.lpush(VALIDATORS, ...(allValidators.map(x => JSON.stringify(x))))
    console.log(`Validators syncronized`)
}