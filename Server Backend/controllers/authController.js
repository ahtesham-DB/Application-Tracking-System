import express from "express";
import mongoose from "mongoose";
import signupModel from "../models/singupModel.js";
import candidateModel from "../models/candidateModel.js";
import validator from "email-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenValidation from "../models/tokenValidation.js";
import goalsMogooseModel from "../models/goalsModel.js";
import "dotenv/config";
const router = express.Router();

export const getCandidates = async (req, res) => {
  if (!req.email_id)
    return res.json({
      message: "unauthenthicated User please signup or Login",
    });

  const data = await candidateModel.find();
  try {
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGoals = async (req, res) => {
  // if (!req.email_id)
  //   return res.json({
  //     message: "unauthenthicated User please signup or Login",
  //   });

  const data = await goalsMogooseModel.findOne();
  try {
    res.status(200).json(data);
  } catch (error) {
    res
      .status(404)
      .json({
        message: error.message,
        ErrorDatabase: "No Goals Set in  Database ",
      });
  }
};

export const postGoals = async (req, res) => {
  const { goals, totalHiring } = req.body;

  //   console.log(email);

  const goalsData = new goalsMogooseModel({
    goals,
    totalHiring,
  });

  try {
    const doc = await goalsMogooseModel.findOne({ goalsData });

    if (!goals.length)
      return res
        .status(404)
        .json({ message: "please enter goals befor update" });
    // await goalsMogooseModel.updateOne(goalsData, {
    //   new: true,
    // });

    await goalsMogooseModel.replaceOne({ doc }, { goals, totalHiring });
    // const existUser = await signupModel.findOne({ email });

    // await goalsData.save();

    res.status(201).json(goalsData);
  } catch (error) {
    res
      .status(409)
      .json({ message: error.message, ErrorDatabase: "goals not updated" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;


  try {
    const existUser = await signupModel.findOne({ email });

    if (!existUser)
      return res.status(404).json({ message: "user doesnt exist" });

    const correctPassword = await bcrypt.compare(password, existUser.password);

    if (!correctPassword)
      return res.status(404).json({ message: "user wrong password" });

    // if(password !== existUser.password) return res.status(404).json({message: "user wrong password"})

    const token = jwt.sign({ email: existUser.email }, process.env.Access_tokenSecretKey, {
      expiresIn: "2h",
    });
    const tokenRefresh = jwt.sign(
      { email: existUser.email },
      process.env.refresh_tokenSecretKey,
      { expiresIn: "2h" }
    );

    //not sending hold uers object just jwt token
    // res.status(200).json(existUser);

    const alreadyIssueToken = await tokenValidation.findOne({ email });

    if (alreadyIssueToken) {
      res.send({ auth: "Error : please sign out first or rest password" });
    } else {
      const tokenValid = new tokenValidation({ tokenRefresh, email });
      await tokenValid.save();
      res.status(200).json({
        email: existUser.email,
        fullname: existUser.fullname,
        Dob: existUser.dob,
        token,
        tokenRefresh,
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const signUp = async (req, res) => {
  const { fullname, email, dob, password, confirmpassword, selectedFile } =
    req.body;

  console.log(email);

  const newFormData = new signupModel({
    fullname,
    email,
    dob,
    password,
    confirmpassword,
    selectedFile,
  });

  try {
    const existUser = await signupModel.findOne({ email });

    if (existUser)
      return res.status(404).json({ message: "user already exist" });
    if (password !== newFormData.confirmpassword)
      return res
        .status(404)
        .json({ message: "password and cofirm-password are diffrent" });

    let emailRegex =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    function isEmailValid(email) {
      if (!email) return false;

      if (email.length > 254) return false;

      var valid = emailRegex.test(email);
      if (!valid) return false;

      // Further checking of some things regex can't handle
      var parts = email.split("@");
      if (parts[0].length > 64) return false;

      var domainParts = parts[1].split(".");
      if (
        domainParts.some(function (part) {
          return part.length > 63;
        })
      )
        return false;

      return true;
    }

    if (!validator.validate(email))
      return res.status(404).json({
        message: "Not valid Email - ID please enter valid Email adress",
      });

      if(!fullname.length || fullname.length < 3){
        return res
        .status(404)
        .json({ message: "Full Name Should be more than 5 char" });
      }

    if (password.length <= 5 )
      return res
        .status(404)
        .json({ message: "Password and Name Should be more than 5 char" });

    newFormData.password = await bcrypt.hash(password, 10);

    const token = jwt.sign({ email: newFormData.email }, process.env.Access_tokenSecretKey, {
      expiresIn: "2h",
    });
    res.status(201).json({ result: newFormData, token });
  

    await newFormData.save();
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const addCandidate = async (req, res) => {
  const {
    fullname,
    email,
    phoneNumber,
    experience,
    currentCTC,
    expectedCTC,
    skilltags,
    adminNote,
    mediumFrom,
    Dob,
    cv,
    status,
    rating,
  } = req.body;

  //   console.log(email);
  //fgfgfg
  const candidateData = new candidateModel({
    fullname,
    email,
    phoneNumber,
    experience,
    currentCTC,
    expectedCTC,
    skilltags,
    adminNote,
    mediumFrom,
    Dob,
    cv,
    status,
    rating,
  });

  try {
    const existUser = await candidateModel.findOne({ email });

    if (existUser)
      return res
        .status(404)
        .json({ message: "candidate already exist in database" });

    if (fullname.length <= 3 || fullname.length >= 18)
      return res
        .status(404)
        .json({ message: "Password and Name Should be more than 5 char" });

    await candidateData.save();

    res.status(201).json(candidateData);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

//update candidate data
export const updateCandidate = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const {
    fullname,
    email,
    phoneNumber,
    experience,
    currentCTC,
    expectedCTC,
    skilltags,
    adminNote,
    mediumFrom,
    Dob,
    cv,
    status,
    rating,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No candidate with id: ${id}`);

  const updatedCandidateData = {
    _id: id,
    fullname,
    email,
    phoneNumber,
    experience,
    currentCTC,
    expectedCTC,
    skilltags,
    adminNote,
    mediumFrom,
    Dob,
    cv,
    status,
    rating,
  };

  // { creator, title, message, tags, selectedFile, _id: id };
  await candidateModel.findByIdAndUpdate(id, updatedCandidateData, {
    new: true,
  });

  res.json(updatedCandidateData);
};

//for future feature implementaion
export const getSingIn = async (req, res) => {
  const { email, password } = req.params;
  // console.log(req.params);
  try {
    const existUser = await FormModel.findOne({ email });

    if (!existUser)
      return res.status(404).json({ message: "user doesnt exist" });
    if (password !== existUser.password)
      return res.status(404).json({ message: "user wrong password" });

    res.status(200).json(existUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export default router;

export const refreshTokenReq = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  // console.log("reqest requestToken");

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken_ = await tokenValidation.findOne({
      tokenRefresh: requestToken,
    });
    console.log("Refresh token is not in database!" + refreshToken_);
    if (!refreshToken_) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    let newAccessToken = jwt.sign(
      { email: "testToeken@hmail.com" },
      process.env.Access_tokenSecretKey,
      {
        expiresIn: "2h",
      }
    );
    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

export const signout = async (req, res) => {
  const { email } = req.body;
  // console.log(email);
  try {
    const existUser = await tokenValidation.findOne({ email });

    if (!existUser)
      return res
        .status(404)
        .json({ message: "can not signOut user doesnt exist or signIn" });

    await tokenValidation.deleteOne({ existUser });

    res.status(200).json(existUser + " Sign Out sucessfully");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password, newPassword } = req.body;
  console.log(email);
  try {
    const existUser = await tokenValidation.findOne({ email });
    // const existUserData = await signupModel.findOne({ email });

    if (!existUser)
      return res
        .status(404)
        .json({ message: "can not resetPassword user doesnt exist " });

    if (existUser.password === password) {
      existUser.password = newPassword;
      await tokenValidation.deleteOne({ existUser });
    }

    res
      .status(200)
      .json(existUser + " Sign Out and Reset Password sucessfully");
    signupModel({ ...existUser, existUser });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
