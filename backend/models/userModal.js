const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const Schema = mongoose.Schema;
const validator = require("validator")

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function(email,password) {

  // validattion
  if(!email || !password){
   throw Error("Email and password are required")
  }

  // check if email  and password are valid
  if(!validator.isEmail(email)){
    throw Error("Email is invalid")
  }

  if(!validator.isStrongPassword(password)){
    throw Error("Password not strong, try create password again, including lowercase letters, numbers and underscores")
  }

  

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password,salt)

  // create user
  const user = await this.create({
    email,
    password : hash
  })
  return user
}

module.exports = mongoose.model("User", userSchema);
