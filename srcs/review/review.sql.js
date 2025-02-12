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
    selectReviewByUser: `
      SELECT *
      FROM Review
      WHERE user_id = ? AND movie_id = ?;
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


    selectReviews: `
      SELECT *
      FROM review
      WHERE movie_id = ?;
    `,
  };
  