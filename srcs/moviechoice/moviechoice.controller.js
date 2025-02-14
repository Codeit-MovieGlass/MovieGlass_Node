import { MovieChoiceService,MovieKeywordService  } from "./moviechoice.service.js";
import { PreferenceService } from "../preference/preference.service.js"; // ✅ preference 추가

export const MovieChoiceController = {
    getMoviesByGenres: async (req, res) => {
        try {
          const { genre } = req.query; // `?genre=액션,드라마`
          const result = await MovieChoiceService.getMoviesByGenres(genre);
          res.status(200).json({ success: true, data: result.movies });
        } catch (error) {
          res.status(500).json({ success: false, message: error.message });
        }
      },
  getMoviesByKeyword: async (req, res) => {
    try {
      const { keyword } = req.query; // 프론트에서 전달한 키워드
      const result = await MovieKeywordService.getMoviesByKeyword(keyword);
      res.status(200).json({ success: true, data: result.movies });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  saveSelectedMoviesAndUpdatePreferences: async (req, res) => {
    try {
        const { user_id, movie_id } = req.body;
        const ratingDIf = 5; // ✅ 항상 5로 고정

        if (!user_id || !Array.isArray(movie_id) || movie_id.length < 3) {
            return res.status(400).json({ success: false, message: "최소 3개의 영화 ID가 필요합니다." });
        }

        // ✅ 사용자 선호도 업데이트 (movie_id 직접 사용)
        for (const id of movie_id) {
          await PreferenceService.updateUserPreferences({ user_id, movie_id: id, ratingDIf });
      }
        res.status(200).json({ success: true, message: "영화 선택 및 사용자 선호도 업데이트 성공" });
    } catch (error) {
        console.error("❌ 영화 선택 및 사용자 선호도 업데이트 오류:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
};
