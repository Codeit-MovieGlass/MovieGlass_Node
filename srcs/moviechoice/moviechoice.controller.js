import { MovieChoiceService,MovieKeywordService  } from "./moviechoice.service.js";

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
  }
};