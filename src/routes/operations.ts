import express  from "express";
import type { RowDataPacket } from "mysql2";
import { db } from "../data/database.js";
import { type ResultSetHeader } from "mysql2/promise";

const router = express.Router();

type OperationRow = RowDataPacket & {
    id: number,
    assetId: number,
    type: "buy" | "sell",
    quantity: number | string,
    unitPrice: number | string,
    date: Date; 
}
type BalanceRow = RowDataPacket & {available: number | string};
type AssetRow = RowDataPacket & { id: number, currentPrice: number | string };

function toOperation(row: OperationRow){
    return {
        id: row.id,
        assetId: row.assetId,
        type: row.type,
        quantity: Number(row.quantity),
        unitPrice: Number(row.unitPrice),
        date: row.date
    }
}
async function getAvailableBalance(assetId: number): Promise<number>{
        const [balanceRows] = await db.query<BalanceRow[]>(
            "SELECT COALESCE(SUM(CASE WHEN type = 'buy' THEN quantity ELSE -quantity END), 0)AS available FROM operations WHERE asset_id = ?", 
            [assetId]
        );
        return Number(balanceRows[0]?.available ?? 0);
    };
router.post("/operations", async (req, res) => {
    const {assetId, type, quantity} = req.body; 

    const invalidType = type !== "buy" && type !== "sell"; 

    const invalidAssetId = 
    typeof assetId !== "number" ||
    assetId <= 0 ||
    !Number.isFinite(assetId) ||
    !Number.isInteger(assetId);

    const invalidQuantity = typeof quantity !== "number" ||
    quantity < 0.00001 ||
    !Number.isFinite(quantity);

    if(invalidAssetId || invalidType || invalidQuantity){
        return res.status(400).json({message: "The operation data is invalid"});   
    };

    const [assetRows] = await db.query<AssetRow[]>(
        "SELECT id, current_price as currentPrice FROM assets WHERE id = ?", 
        [assetId]
    );
    const asset = assetRows[0];
    if(!asset){
        return res.status(404).json({message: "Asset not found"});
    }
    const unitPrice = Number(asset.currentPrice);

    if (type === "sell"){

        const availableBalance = await getAvailableBalance(assetId);

        if(availableBalance < quantity){
            return res.status(409).json({message: "insufficient balance to do the sell operation"})
        };
    };
    const [result] = await db.query<ResultSetHeader>(
        "INSERT INTO operations (asset_id, type, quantity, unit_price, date) VALUES (?,?,?,?,CURRENT_TIMESTAMP)",
        [assetId, type, quantity, unitPrice]
    );
    const [rows] = await db.query<OperationRow[]>(
        "SELECT id, asset_id as assetId, type, quantity, unit_price as unitPrice, date FROM operations WHERE id = ?",
        [result.insertId]
    );
    const created = rows[0];

    if(!created){
        return res.status(500).json({message: "Failed to create operation"});
    }
    return res.status(201).json(toOperation(created));
});
router.get("/operations", async (req, res)=>{
    const[rows] = await db.query<OperationRow[]>("SELECT id, asset_id AS assetId, type, quantity, unit_price as unitPrice,date FROM operations ORDER BY id");
    res.status(200).json({operations: rows.map(toOperation)});
});
export default router;