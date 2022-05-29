import { body } from "express-validator";

const whiteListStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-#*+-()%&'!?:.;,>< ";

const recipeValidators = [
    body("name").isWhitelisted(whiteListStr).isString().withMessage("invalid-name"),
    body("info").isString().withMessage("invalid-name"),
    body("info").isLength({max:200}).withMessage("max-200-characters"),
    
]

export default recipeValidators