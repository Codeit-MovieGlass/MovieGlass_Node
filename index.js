import express from "express"; // ES6
import { response } from "./config/response.js";
import cors from "cors";
import { userRouter } from "./srcs/user/user.route.js";
import authRouter from "./srcs/auth/auth.route.js";
import curationRouter from "./srcs/curation/curation.route.js";
import movieRouter from "./srcs/movie/movie.route.js";
import moviechoiceRouter from "./srcs/moviechoice/moviechoice.route.js";
import aichatRouter from "./srcs/aichat/aichat.route.js";
import { mypageRouter } from "./srcs/mypage/mypage.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors({origin: 'http://localhost:3000',credentials: true}));

app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/movies", movieRouter);
app.use("/moviechoice", moviechoiceRouter);
app.use("/curations", curationRouter);
app.use("/aichat", aichatRouter);
app.use("/mypage", mypageRouter);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  console.log(err.message);
  res.status(err.data.status).send(response(err.data));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
