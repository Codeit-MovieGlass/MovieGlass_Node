export const sql = {
    // 특정 장르의 모든 영화 조회
    getMoviesByGenres: (genreCount) => `
    SELECT 
      movie_id AS id,
      kmdb_id AS kmdbId,
      movie_name AS movieName,
      production_year AS productionYear,
      production_genre AS productionGenre,
      production_country AS productionCountry,
      production_image AS productionImage,
      horizontal_image AS horizontalImage,
      trailer_url AS trailerUrl,
      production_keyword AS productionKeyword
    FROM Movie
    WHERE ${Array(genreCount).fill("production_genre LIKE ?").join(" OR ")};
  `,
    getMoviesByKeyword: `
    SELECT 
      movie_id AS id,
      kmdb_id AS kmdbId,
      movie_name AS movieName,
      production_year AS productionYear,
      production_genre AS productionGenre,
      production_country AS productionCountry,
      production_image AS productionImage,
      horizontal_image AS horizontalImage,
      trailer_url AS trailerUrl,
      production_keyword AS productionKeyword
    FROM Movie
    WHERE production_keyword LIKE ?;
  `,
  insertSelectedMovies: `
    INSERT INTO SelectedMovies (user_id, movie_id)
    VALUES ?;
  `
};
