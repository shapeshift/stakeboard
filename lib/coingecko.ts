import axios from "axios";


interface TokenPriceList{
  [id: string]: TokenPrice
}

interface TokenPrice{
  usd: number
}

export const getTokenPrice = async (ticker: string): Promise<TokenPriceList> => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${ticker}&vs_currencies=usd`
  );
  return data;
};
