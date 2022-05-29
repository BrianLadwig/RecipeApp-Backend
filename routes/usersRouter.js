import express from "express";
import createError from "http-errors";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import userValidators from "../validators/userValidators.js";
import loginValidators from "../validators/loginValidators.js"
import requestValidator from "../middlewares/requestValidator.js";

const userRouter = express.Router();

userRouter
  .get("/", async (req, res, next) => {
    try {
      const query = User.find(req.params);
      query.populate("userRecipes", "name");
      query.populate("favorites", "name");

      const users = await query.exec();
      res.send(users);
    } catch (error) {
      next(error);
    }
  })
  .get("/:id", async (req, res, next) => {
    try {
      const query = User.findById(req.params.id);
      query.populate("userRecipes", "name");
      query.populate("favorites", "name");

      const user = await query.exec();

      if (!user) {
        return next(createError(404, "User not found"));
      }

      res.send(user);
    } catch (error) {
      next(error);
    }
  })
  .post("/register",requestValidator(userValidators), async (req, res, next) => {
    try {
      const user = await User.register(req.body);
      res.send(user);
    } catch (error) {
      next(createError(400, error.message));
    }
  })
  .post('/login',requestValidator(loginValidators), async (req,res) => { 
    const user = await User.login(req.body)

    if (user){
        return res.send(user)
    }
    res.status(401).send({ success: false, error: "Invalid credentials" })
 })
  .patch("/:id", async (req, res, next) => {
    try {
      const recipeId = req.body.recipeId;
      const recipe = await Recipe.findById(recipeId);

      if (!recipe) {
        return next(createError(404, "Recipe not found"));
      }

      const userQuery = User.findById(req.params.id);

      userQuery.populate("favorites", "name");
      const user = await userQuery.exec();

      if (!user) {
        return next(createError(404, "User not found"));
      }

      const isFavorite = user.favorites.find(
        (x) => x.id.toString() === recipeId
      );

      if (!isFavorite) {
        user.favorites.push(recipe);
      } else {
        user.favorites = user.favorites.filter((x) => x.id.toString() !== recipeId);
        console.log(user.favorites.filter((x) => x.id.toString() !== recipeId));
      }

      await user.save();

      res.send(user);
    } catch (error) {
      next(createError(400, error.message));
    }
  })
  .delete("/:id", async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return next(createError(404, "User not found"));
      }

      await user.remove();
      res.send({ ok: true, deleted: user });
    } catch (error) {
      next(createError(400, error.message));
    }
  });

export default userRouter;
