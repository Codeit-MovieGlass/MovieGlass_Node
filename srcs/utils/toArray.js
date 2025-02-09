export const parseCommaSeparatedString = (str) => {
  if (!str) return []; // null 또는 undefined이면 빈 배열 반환
  return str.split(",").map((item) => item.trim()); // 콤마로 분할 후 trim 적용
};
