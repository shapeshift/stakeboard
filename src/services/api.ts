import axios from "axios"
import _ from "lodash";
import { tmpdir } from "os";
import { CosmosTxResponse, Tx } from "./types"


export const getFullValidatorHistory = async (): Promise<Tx[]> => {
    var nextPage = true;
    var allTx: Tx[] = []
    
    var tx = await getTx("")

    while(nextPage){
        if(!tx.cursor){
            nextPage = false
        }
        allTx = allTx.concat(tx.txs)

        var firstTimestamp =  _.min(allTx.map((transaction) => {
            return transaction.timestamp
        }))

        console.log(`${new Date().toISOString()} First tx timestamp: ${new Date(firstTimestamp*1000).toISOString()}`)

        tx = await getTx(tx.cursor)
    }
    return allTx
}


export const getTx = (async (cursor: string): Promise<CosmosTxResponse> => {
      const { data } = await axios.get(`http://localhost:3000/api/v1/validators/cosmosvaloper199mlc7fr6ll5t54w7tts7f4s0cvnqgc59nmuxf/txs?cursor=${cursor}`, { params: { cursor: cursor, pageSize: 50 } })
      return data
  })