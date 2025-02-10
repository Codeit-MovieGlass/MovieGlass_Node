import { MovieChoiceModel, MovieKeywordModel } from "./moviechoice.model.js";

export const MovieChoiceService = {
  getMoviesByGenres: async (genres) => {
    try {
      if (!genres) {
        throw new Error("장르 정보가 필요합니다.");
      }
      const movies = await MovieChoiceModel.getMoviesByGenres(genres);
      return { movies };
    } catch (error) {
      console.error("장르별 영화 조회 서비스 오류:", error);
      throw new Error("장르별 영화 조회 실패");
    }
  },
  saveSelectedMovies: async (user_id, kmdbIds) => {
    try {
      if (!user_id || kmdbIds.length < 3) {
        throw new Error("사용자 ID와 최소 3개의 영화 ID가 필요합니다.");
      }
      
      // ✅ 여기서 DB 저장 로직 추가 (선택한 영화 저장 테이블이 필요)
      console.log(`✅ ${user_id} 사용자가 다음 영화를 선택했습니다:`, kmdbIds);
      return { success: true };
    } catch (error) {
      console.error("❌ 선택한 영화 저장 오류:", error);
      throw new Error("선택한 영화 저장 실패");
    }
  }
};
export const MovieKeywordService = {
  getMoviesByKeyword: async (keyword) => {
    try {
      if (!keyword) {
        throw new Error("키워드 정보가 필요합니다.");
      }
      const movies = await MovieKeywordModel.getMoviesByKeyword(keyword);
      return { movies };
    } catch (error) {
      console.error("키워드별 영화 조회 서비스 오류:", error);
      throw new Error("키워드별 영화 조회 실패");
    }
  }
};
export const MovieSelectionService = {
  saveSelectedMovies: async (user_id, kmdbIds) => {
    try {
      if (!user_id || kmdbIds.length < 3) {
        throw new Error("사용자 ID와 최소 3개의 영화 ID가 필요합니다.");
      }
      
      // ✅ 여기서 DB 저장 로직 추가 (선택한 영화 저장 테이블이 필요)
      console.log(`✅ ${user_id} 사용자가 다음 영화를 선택했습니다:`, kmdbIds);
      return { success: true };
    } catch (error) {
      console.error("❌ 선택한 영화 저장 오류:", error);
      throw new Error("선택한 영화 저장 실패");
    }
  }
};