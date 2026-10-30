import Express from "express";
import type { RowDataPacket } from "mysql2";
import { assets } from "../data/assets.js"
import type { Asset } from "../data/assets.js"
import { db } from "../data/database.js";

const router = Express.Router()

type AssetRow = RowDataPacket & {
    id: number;
    ticker: string;
    name: string;
    currentPrice: number | string;
}

router.get("/assets", async (req,res) => {
    const [rows] = await db.query<AssetRow[]>(
        "SELECT id, ticker, name, price_updated_at AS priceUpdatedAt, current_price AS currentPrice FROM assets ORDER BY id"
    );
    res.json(rows.map((row) => ({
        id: row.id,
        ticker: row.ticker,
        name: row.name,
        currentPrice: Number(row.currentPrice),
        priceUpdatedAt: row.priceUpdatedAt
    })));
})
router.post("/assets", async (req, res) =>{ 
    const {ticker, name, currentPrice} = req.body
    if(typeof ticker !== "string"){
        return res.status(400).json({ 
            message: "Invalid ticker"
        });
    }
    const normalizedTicker = ticker.trim().toUpperCase();
    const invalidTicker = 
    normalizedTicker.length < 3 || normalizedTicker.length > 5;
    const invalidName = 
    typeof name !== "string" || name.trim().length === 0;
    const invalidPrice = 
    typeof currentPrice !== "number" || currentPrice <= 0 || !Number.isFinite(currentPrice); 
    if(invalidName || invalidTicker || invalidPrice){
        return res.status(400).json({ 
            message: "Invalid data"
        });
    }else{
        const [result] = await db.query(
            "INSERT INTO assets (ticker, name, current_price, price_updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
            [normalizedTicker, name.trim(), currentPrice]
        )
        res.status(201).json(result)
}})
export default router