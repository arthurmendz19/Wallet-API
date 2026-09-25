import Express from "express";

const router = Express.Router()
type Asset = { 
    id: number;
    ticker: string;
    name: string;
    currentPrice: number;
}
const assets: Asset[] = []

router.get("/assets", (req,res) => {
    res.json(assets)
})

router.post("/assets", ((req, res) =>{ 
    const {ticker, name, currentPrice} = req.body
    const invalidTicker = 
    typeof ticker !== "string" || ticker.length < 3 || ticker.length > 5;
    const invalidName = 
    typeof name !== "string" || name.trim().length === 0;
    const invalidPrice = 
    typeof currentPrice !== "number" || currentPrice <= 0 || !Number.isFinite(currentPrice); 
    
    if(invalidName || invalidTicker || invalidPrice){ 
        return res.status(400).json({ 
            message: "Invalid data"
        });
    }else{
        let nextId: number;  
        if(assets.length === 0){ 
            nextId = 1
        }else{ 
            const ids = assets.map(asset => asset.id);
            const biggestId = Math.max(...ids); 
            nextId = biggestId + 1;
        }
        const newAsset: Asset = { 
            id: nextId, 
            ticker: ticker,
            name: name, 
            currentPrice: currentPrice
        }
        assets.push(newAsset)
        res.status(201).json(newAsset)
    }
}))



export default router