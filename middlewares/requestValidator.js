import { validationResult } from "express-validator";

function requestValidator(rules) {
  const middlewares = [...rules];

  middlewares.push((req, res, next) => {
    const validationResults = validationResult(req);

    if (validationResults.isEmpty()) {
      return next();
    }

    const validationErrors = validationResults.array().map((err) => {
      return { [err.param]: err.msg };
    });

    res.status(400).send({ errors: validationErrors });
  });

  return middlewares;
}

export default requestValidator;
