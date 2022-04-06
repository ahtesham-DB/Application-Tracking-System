import express from "express";

import {
  signIn,
  signUp,
  addCandidate,
  getCandidates,
  updateCandidate,
  refreshTokenReq,
  signout,
  resetPassword,
  postGoals,
  getGoals
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";

import { errorHandler , notFound } from "../middleware/errorHandler.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("server running ");
});
router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/addCandidate", addCandidate);
router.get("/getCandidates", auth, getCandidates);
router.patch("/updateCandidate:id", updateCandidate);
router.post("/api/auth/refreshtoken", refreshTokenReq);
router.delete("/api/auth/signout", signout);
router.post("/api/auth/reset", resetPassword);
router.post("/goals", postGoals);
router.get("/goals", getGoals);

router.use(notFound);
router.use(errorHandler);

export default router;
