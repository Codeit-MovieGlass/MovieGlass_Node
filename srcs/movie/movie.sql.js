export const movieSQL = {
    getTop10Movies: `
      SELECT 
        movie_id AS id,
        kmdb_id AS kmdbId,
        movie_name AS movieName,
        production_year AS productionYear,
        production_genre AS productionGenre,
        production_country AS productionCountry,
        production_image AS productionImage,
        horizontal_image AS horizontalImage,
        trailer_url AS trailerUrl
      FROM Movie
      ORDER BY RAND() 
      LIMIT 10;
    `
  };
  