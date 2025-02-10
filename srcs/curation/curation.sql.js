export const sql = {

  getEmotionCurations: `
  SELECT 
      c.curation_id,
      c.curation_name,
      c.curation_type,
      JSON_ARRAYAGG(
      JSON_OBJECT(
          'movieId', m.movie_id,
          'title', m.movie_name,
          'posterUrl', m.production_image
      )
      ) AS movies
  FROM Curation c
  JOIN CurationMovie cm ON c.curation_id = cm.curation_id
  JOIN Movie m ON cm.movie_id = m.movie_id
  WHERE c.curation_id = ?
  GROUP BY c.curation_id;
  `,


  getTwoCurations : `
    SELECT 
      c.curation_id,
      c.curation_name,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'movie_id', m.movie_id,
          'movie_name', m.movie_name,
          'poster_url', m.production_image
        )
      ) AS movies
    FROM Curation c
    JOIN CurationMovie cm ON c.curation_id = cm.curation_id
    JOIN Movie m ON cm.movie_id = m.movie_id
    WHERE c.curation_id BETWEEN 1 AND 20
    GROUP BY c.curation_id
    ORDER BY RAND()
    LIMIT 2;
  `,

  shuffleCurations: `
    SELECT 
        c.curation_id,
        c.curation_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'movie_id', m.movie_id,
            'movie_name', m.movie_name,
            'poster_url', m.production_image
          )
        ) AS movies
    FROM Curation c
    JOIN CurationMovie cm ON c.curation_id = cm.curation_id
    JOIN Movie m ON cm.movie_id = m.movie_id
    WHERE c.curation_id NOT IN (?)  -- 제외할 큐레이션 ID 리스트 추가
      AND c.curation_id BETWEEN 1 AND 20  -- curation_id가 1~20인 경우에 대해서만
    GROUP BY c.curation_id
    ORDER BY RAND()
    LIMIT 3;
    `,


    getWeatherCuration: `
    SELECT 
        c.curation_id,
        c.curation_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'movie_id', m.movie_id,
            'movie_name', m.movie_name,
            'poster_url', m.production_image
          )
        ) AS movies
    FROM Curation c
    JOIN CurationMovie cm ON c.curation_id = cm.curation_id
    JOIN Movie m ON cm.movie_id = m.movie_id
    WHERE c.curation_id = ?
    GROUP BY c.curation_id
    ORDER BY RAND()
    LIMIT 3;
    `,
};
