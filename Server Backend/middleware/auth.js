import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(" ")[1]
    const token = req.headers.authorization.split("Bearer ")[1];
    // const token = req.header("token")
    let decodedData = jwt.verify(token, process.env.Access_tokenSecretKey);

    req.email_id = decodedData?.email;

    next();
  } catch (error) {
    console.log(error);
    console.log("auth error");
    res.send("Not Valid  Auth Token");
  }
};

export default auth;
