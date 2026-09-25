import type {ErrorRequestHandler , Request, Response} from "express"

export const notFoundRequest = (req: Request, res: Response) => { 
    res.status(404).json({
        "ERROR": "Not Found Request"
    })
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => { 
    console.log(err)
    res.status(500).json("Internal Server Error")
}
