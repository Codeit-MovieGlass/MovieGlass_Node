export const sql = {
    insertReview: `
      INSERT INTO Review (user_id, movie_id, rating, review_comment, view_count)
      VALUES (?, ?, ?, ?, ?);
    `
  };
  