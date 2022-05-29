import { body } from "express-validator";

const loginValidators = [
  body("email").isEmail().withMessage("email-invalid"),
  body("email").normalizeEmail({ gmail_remove_subaddress: true }),
];

export default loginValidators;
