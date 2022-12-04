import { DelegatorMapEntry } from "./service";

export const uAtomToAtom = (amount: number) => amount / 1000000;
export const atomtoUAtom = (amount: number) => amount * 1000000;

export const filterAMap = (addressStakedValueMap : Map<string, DelegatorMapEntry>, condition : (entry: DelegatorMapEntry) => Boolean) => {
    return new Map(
        Array.from(addressStakedValueMap).filter(([key, entry]) => {
          if (condition(entry)) {
            return true;
          }
      
          return false;
        }),
      );
 }
