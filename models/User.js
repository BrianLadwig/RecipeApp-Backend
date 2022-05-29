import mongoose from "mongoose";
import Recipe from "./Recipe.js";
import { compareHashes, hash } from "../lib/crypto.js";

const { Schema, model } = mongoose;
const timestamps = true;
const required = true;
const unique = true;
const trim = true;

const userSchema = new Schema(
  {
    firstName: { type: String, required, trim },
    lastName: { type: String, required, trim },
    userName: { type: String, required, unique, trim },
    email: { type: String, required, unique, trim },
    password: { type: String, required },
    favorites: { type: [Schema.Types.ObjectId], ref: "recipe" },
    userRecipes: { type: [Schema.Types.ObjectId], ref: "recipe" },
  },
  { timestamps }
);

userSchema.statics.register = async function (data) {
  const hashed = await hash(data.password);
  data.password = hashed;
  return User.create(data);
};

userSchema.statics.login = async function (data) {
  console.log("email?",data.email);
  const user = await User.findOne({ email: data.email });
  // console.log("???", user);
  if (!user) {
    return false;
  }

  const success = await compareHashes(data.password, user.password);

  return success ? user : false;
};
userSchema.options.toJSON = {
  transform: function (document, documentAsJSON, options) {
    delete documentAsJSON.__v;
    return documentAsJSON;
  },
};

userSchema.pre("remove", async function () {
  console.log("User is being removed " + this._id);
  await Recipe.deleteMany({ author: this._id });
});

const User = model("user", userSchema);
export default User;
