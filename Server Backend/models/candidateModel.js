import mongoose from "mongoose";

const candidate = mongoose.Schema({
  fullname: String,
  email: String,
  phoneNumber: String,
  experience: String,
  currentCTC: String,
  expectedCTC: String,
  skilltags: String,
  adminNote: String,
  mediumFrom: String,
  Dob: String,
  cv: String,
  status: String,
  Rating: String,
});

var candidateModel = mongoose.model("candidate", candidate);

export default candidateModel;
