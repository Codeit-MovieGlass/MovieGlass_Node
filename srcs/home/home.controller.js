import { HomeService } from "./home.service.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

// 홈 데이터 가져오기
export const getHomeData = async (req, res) => {
  try {
    const weather  = "맑음"; // TODO : 날씨 API 연동 후 수정
    const homeData = await HomeService.getHomeData(weather);

    res.send(response(status.SUCCESS, {
      success: true,
      message: "홈 데이터를 성공적으로 가져왔습니다.",
      data: homeData
    }));
  } catch (error) {
    console.error("홈 데이터 가져오기 오류:", error);
    res.send(response(status.BAD_REQUEST, { success: false, message: "홈 데이터를 가져오는 중 오류 발생" }));
  }
};
