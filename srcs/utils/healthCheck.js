import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js"

export const healthCheck = async (req,res,next) => {
    try{
        return res.send(response(status.SUCCESS,null));
        
    }catch(error){

        throw new BaseError(status.BAD_REQUEST);
        
    }
}
