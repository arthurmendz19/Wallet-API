export type Asset = { 
    id: number;
    ticker: string;
    name: string;
    currentPrice: number;
}
export const assets: Asset[] = []