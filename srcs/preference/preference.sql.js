export const sql = {
    // 장르 가중치 업데이트 (기존 값이 있으면 증가, 없으면 삽입)
    updateGenrePreference: `
      INSERT INTO user_preference_weights (user_id, type, name, weight)
      VALUES (?, 'GENRE', ?, ?)
      ON DUPLICATE KEY UPDATE weight = weight + ?;
    `,
  
    // 키워드 가중치 업데이트 (기존 값이 있으면 증가, 없으면 삽입)
    updateKeywordPreference: `
      INSERT INTO user_preference_weights (user_id, type, name, weight)
      VALUES (?, 'KEYWORD', ?, ?)
      ON DUPLICATE KEY UPDATE weight = weight + ?;
    `
  };
  