export const response = ({ isSuccess, code, message }, result) => {
  console.log("response 호출됨:", { isSuccess, code, message, result });
  return {
    isSuccess: isSuccess,
    code: code,
    message: message,
    result: result,
  };
};

export const responseData = (data) => {
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
