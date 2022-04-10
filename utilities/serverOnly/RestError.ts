import { NextApiResponse } from "next";
import { FailableResponse } from "../types/responseTypes";

export class RestError extends Error {
    code: number;

    constructor(message: string, code: number){
        super(message);
        this.code = code;
    }
}

export function handleAPIError(res: NextApiResponse, error: any){
    console.error(error);

    (res as NextApiResponse<FailableResponse>).status(error.code ?? 500).json({ 
        failed: true, 
        errorMessage: error.message 
    });
}