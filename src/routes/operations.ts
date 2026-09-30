import express  from "express";
import {assets} from "../data/assets.js"


const router = express.Router();

type Operation = {
    id: number,
    assetId: number, 
    type: "buy" | "sell",
    quantity: number, 
    unitPrice: number, 
    date: string;
}

const operations: Operation[] = [];

router.post("/operations", (req, res) => { 
    const {assetId, type, quantity, unitPrice} = req.body; 

    const invalidType = type !== "buy" && type !== "sell"; 
    const invalidAssetId = typeof assetId !== "number" || assetId <= 0 || !Number.isFinite(assetId) || !Number.isInteger(assetId);
    const invalidQuantity = typeof quantity !== "number" || quantity < 0.01 || !Number.isFinite(quantity);
    const invalidUnitPrice = typeof unitPrice !== "number" || unitPrice < 0.01 || !Number.isFinite(unitPrice); 
    
    if(invalidAssetId || invalidType || invalidQuantity || invalidUnitPrice){
        return res.status(400).json({message: "The operation data is invalid"});   
    };

    const asset = assets.find(item => item.id === assetId);

    if(!asset){
        return res.status(404).json({
            message: "Asset not found"
        });
    };
    if(type === "sell"){ 
        const assetOwn = operations.filter(operation => operation.assetId === assetId);
        let availableQuantity = 0;
        for(const operation of assetOwn){
            if(operation.type === "buy"){
                availableQuantity += operation.quantity;
            }else{
                availableQuantity -= operation.quantity;
            };
        }
        if(availableQuantity < quantity){ 
            return res.status(409).json({
                message: "Available quantity is less than requested for sale"
            });
        };
    };    
    let opId: number; 
    if(operations.length === 0){ 
        opId = 1 
    }else{ 
        const ids = operations.map(operation => operation.id); 
        const biggestId = Math.max(...ids); 
        opId = biggestId + 1; 
    }
    const newOperation = { 
        id: opId, 
        assetId: asset.id,
        date: new Date().toISOString(),
        type: type, 
        quantity: quantity,
        unitPrice: unitPrice
    }
    operations.push(newOperation);
    res.status(201).json(newOperation);
});
router.get("/operations", (req, res)=>{ 
    res.json(operations);
});
export default router;




