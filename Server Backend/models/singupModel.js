import mongoose from "mongoose";

const signup = mongoose.Schema({
  fullname: {type:String, required: true},
  email: String,
  password: String,
  confirmpassword: String,
});

var signupModel = mongoose.model("formData", signup);

export default signupModel;
