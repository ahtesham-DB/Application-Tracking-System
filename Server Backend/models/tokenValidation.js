import mongoose from "mongoose";

const tokenRefresh_ = mongoose.Schema({
  tokenRefresh: String,
  email: { type: String, required: true, unique: true },
});

var tokenRefreshModel = mongoose.model("RerfeshTokenList", tokenRefresh_);

export default tokenRefreshModel;
