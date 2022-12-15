import axios from "axios";
import { VALIDATOR_ADDR } from "./const";
import { CosmosTxResponse, ValidatorResponse } from "./types";

export const getValidators = async (cursor?: string): Promise<ValidatorResponse> => {
  const { data } = await axios.get(
    `${process.env.UNCHAINED_HOST}/api/v1/validators`, { params: { cursor: cursor } }
  );
  return data;
};

// This call fails every now and then due to I/O timeouts on unchained. Instead of having a retry mechanism
// this is implicitly handled by the sync mechanism - on the first /sync call after a failure it simply picks up where it left off
export const getTx = async (cursor?: string): Promise<CosmosTxResponse> => {
  try {
    const { data } = await axios.get(
      `${process.env.UNCHAINED_HOST}/api/v1/validators/${VALIDATOR_ADDR}/txs`,
      { params: { cursor: cursor } }
    );
    return data;
  } catch (err) {
    if(axios.isAxiosError(err)){
      console.log("Unchained request failed: ", err.message, err.code, err.cause, err.stack, err.status)
    }else{
      console.log("Unchained request failed: ", err)
    }
  }
};
