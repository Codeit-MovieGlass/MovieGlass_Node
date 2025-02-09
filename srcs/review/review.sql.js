export const sql = {
    insertReview: `
      INSERT INTO Review (user_id, movie_id, rating, review_comment, view_count)
      VALUES (?, ?, ?, ?, ?);
    `,

    selectReview: `
      SELECT *
      FROM Review
      WHERE review_id = ?;
    `,

    updateReview: `
      UPDATE Review
      SET rating = ?, review_comment = ?, view_count = ?
      WHERE review_id = ?;
    `,
    deleteReview: `
      DELETE FROM Review
      WHERE review_id = ?;
    `,
  };
  