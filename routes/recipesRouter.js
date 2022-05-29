import express from "express";
import createError from "http-errors";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import recipeValidators from "../validators/recipeValidators.js"
import requestValidator from "../middlewares/requestValidator.js";

const recipesRouter = express.Router();

recipesRouter
  .get("/", async (req, res, next) => {
    try {
      const query = Recipe.find(req.query);
      query.populate("author", "userName");

      const recipes = await query.exec();
      res.send(recipes);
    } catch (error) {
      next(error);
    }
  })
  .get("/:id", async (req, res, next) => {
    try {
      const query = Recipe.findById(req.params.id);
      query.populate("author", "userName");

      const recipe = await query.exec();
      if (!recipe) {
        return next(createError(404, "Recipe not found"));
      }
      res.send(recipe);
    } catch (error) {
      next(error);
    }
  })
  .post("/",requestValidator(recipeValidators), async (req, res, next) => {
    try {
      const author = await User.findById(req.body.author);

      if (!author) {
        return next(createError(404, "User not found"));
      }

      const recipe = await Recipe.create(req.body);
      author.userRecipes.push(recipe);
      await author.save();

      res.send(recipe);
    } catch (error) {
      next(createError(400, error.message));
    }
  })
  .patch("/:id", async (req, res, next) => {
    try {
      const queryOptions = { new: true, runValidators: true };
      const id = req.params.id;

      const query = Recipe.findByIdAndUpdate(id, req.body, queryOptions);
      query.populate("author","name");

      const recipe = await query.exec();

      if (!recipe) {
        return next(createError(404, "Recipe not found"));
      }

      res.send(recipe);
    } catch (error) {
      next(createError(400, error.message));
    }
  })
  .delete("/:id", async (req, res, next) => {
    try {
      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        return next(createError(404, "Recipe not found"));
      }

      await recipe.remove();
      res.send({ ok: true, deleted: recipe });
    } catch (error) {
      next(createError(400, error.message));
    }
  });

export default recipesRouter;
