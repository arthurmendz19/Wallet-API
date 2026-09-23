import express from "express";
import helmet from "helmet";

const app = express(); 

app.use(helmet()); 
app.use(express.json())

app.get("/wallet", (req, res) => { 
    res.json({ "message": "the server are work"})
})

app.listen(3333, () =>{ 
    console.log("server is working in http://localhost:3333/")
})
