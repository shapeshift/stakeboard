import { TX_COLLECTION } from "@/lib/const";
import { Event, Tx } from "@/lib/types";
import Redis from "ioredis";
import _ from "lodash";

export type ValidatorTx = {
  validatorAddr: string;
  stakerAddr: string;
  amount: number;
  type: ValidatorTxType;
  timestamp: number;
  memo: string;
};

export enum ValidatorTxType {
  Delegate,
  Compound,
  Unbond,
}

interface EventBundle {
  timestamp: number;
  memo: string;
  event: Event;
}

export const getAllTx = async (): Promise<ValidatorTx[]> => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
  });

  const allTx: Tx[] = (await redis.lrange(TX_COLLECTION, 0, -1)).map((x) =>
    JSON.parse(x)
  );

  return convertToValidatorTx(allTx);
};

const getDelegateTx = (allEvents: EventBundle[]): ValidatorTx[] => {
  return allEvents
  .filter(
    (evb) =>
      evb.event.message.action === "/cosmos.staking.v1beta1.MsgDelegate"
  )
  .map((evb) => {
    return {
      stakerAddr: evb.event.coin_spent.spender,
      validatorAddr: evb.event.delegate.validator,
      amount: extractAmount(evb.event.coin_spent.spender),
      type: ValidatorTxType.Delegate,
      timestamp: evb.timestamp,
      memo: evb.memo,
    };
  });
}

const getCompoundTx = (allEvents: EventBundle[]): ValidatorTx[] => {
  allEvents
  .filter(evb => evb.event.message.action === "/cosmos.authz.v1beta1.MsgExec")
  return []
}

const getUnbondTx = (allEvents: EventBundle[]): ValidatorTx[] => {
  return allEvents
  .filter(evb => evb.event.message.action === "/cosmos.staking.v1beta1.MsgUndelegate")
  .map((evb) => {
    return {
      stakerAddr: evb.event.coin_received.receiver,
      validatorAddr: evb.event.unbond.validator,
      amount: extractAmount(evb.event.coin_received.receiver),
      type: ValidatorTxType.Unbond,
      timestamp: evb.timestamp,
      memo: evb.memo,
    };
  })
}

const convertToValidatorTx = (allTx: Tx[]): ValidatorTx[] => {
  const allEvents: EventBundle[] = allTx.flatMap((x) =>
    Object.entries(x.events).map((ev) => {
      return { timestamp: x.timestamp, memo: x.memo, event: ev[1] };
    })
  );

  const delegateTx: ValidatorTx[] = getDelegateTx(allEvents)
  const compoundTx: ValidatorTx[] = getCompoundTx(allEvents)
  const unbondTx: ValidatorTx[] = getUnbondTx(allEvents)

  const allValidatorTx = _.sortBy(
    [...delegateTx, ...compoundTx, ...unbondTx],
    (x) => x.timestamp
  );
  return allValidatorTx;
};

const extractAmount = (amountStr: string): number => {
  return Number(amountStr.split("uatom")[0]);
};
