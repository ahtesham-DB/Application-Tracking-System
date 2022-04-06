import mongoose from "mongoose";

const goals = mongoose.Schema({
    goals: String,
    totalHiring: String,
});

var goalsMogooseModel = mongoose.model("goals", goals);

export default goalsMogooseModel;