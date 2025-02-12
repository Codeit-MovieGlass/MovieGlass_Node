export const response = (data) => {
  return {
    isSuccess: true,
    code: 200,
    message: "성공",
    result: data,
  };
};

export const errorResponse = (message, code = 500) => {
  return {
    isSuccess: false,
    code,
    message,
    result: null,
  };
};
