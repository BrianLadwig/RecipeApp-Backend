import { body } from "express-validator";

const whiteListStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-#*+-()%&'!?:.;,>< ";

const userValidators = [
    body("firstName").isWhitelisted(whiteListStr).isString().withMessage("invalid-firstName"),
    body("lastName").isWhitelisted(whiteListStr).withMessage("invalid-lastName").isString(),
    body("userName").isWhitelisted(whiteListStr).isString().withMessage("invalid-userName"),
    body("email").isEmail().withMessage("email-invalid"),
    body("email").normalizeEmail({gmail_remove_subaddress: true}),
    body("password").isLength({ min: 8}).withMessage("password-min-8-characters"),
    body("password").isLength({max: 18 }).withMessage("password-max-18-characters"),
    body("password").isStrongPassword().withMessage("password-not-strong-enough")
];

export default userValidators;