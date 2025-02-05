import express from "express"; // ES6
import { response } from "./config/response.js";
import { healthCheck } from "./srcs/utils/healthCheck.js";
import cors from "cors";
import { userRouter } from "./srcs/user/user.route.js";
import  authRouter  from "./srcs/auth/auth.route.js";
import  curationRouter  from "./srcs/curation/curation.route.js";
import  movieRouter  from "./srcs/movie/movie.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());


//health
app.use("/health", healthCheck);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/curations", curationRouter);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  console.log(err.message);
  res.status(err.data.status).send(response(err.data));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
