import mongoose from "mongoose";
import User from "./User.js";

const { Schema, model } = mongoose;
const timestamps = true;
const required = true;
const trim = true;

const ingredientsSchema = new Schema({
  amount: { type: Number, required },
  unit: { type: String, required, trim },
  ingredient: { type: String, required },
});

const recipeSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "user", required },
    name: { type: String, required, trim },
    time: { type: String },
    info: { type: String },
    ingredients: { type: [ingredientsSchema] },
    instructions: { type: [String], required, trim },
    notes: { type: String, trim },
    category: {
      type: String,
      required,
      enum: ["breakfast", "meal", "snack", "drink"],
    },
    pic: { type: String },
    public: { type: Boolean },
  },
  { timestamps }
);

recipeSchema.pre("remove", async function () {
  const id = this._id.toString();
  console.log("Recipe is being removed " + id);

  const author = await User.findById(this.author);

  if (author) {
    author.userRecipes = author.userRecipes.filter((x) => x.toString() !== id);
    await author.save();
  }
});

const Recipe = model("recipe", recipeSchema);
export default Recipe;
