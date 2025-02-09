export const sql = {
    // 기존 데이터 확인 (user_id, type, name이 같은 데이터가 있는지 조회)
    checkExistingPreference: `
      SELECT * FROM user_preference_weights WHERE user_id = ? AND type = ? AND name = ?;
    `,
  
    // 기존 데이터가 있으면 weight 증가
    updateExistingPreference: `
      UPDATE user_preference_weights SET weight = weight + ? WHERE user_id = ? AND type = ? AND name = ?;
    `,
  
    // 기존 데이터가 없으면 새로 삽입
    insertNewPreference: `
      INSERT INTO user_preference_weights (user_id, type, name, weight)
      VALUES (?, ?, ?, ?);
    `,  
};