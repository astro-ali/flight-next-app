export const toErrorMap = (errors: any) => {
  const errorMap = {};

  if(typeof errors == "object"){
    Object.keys(errors).forEach((key) => {
      errorMap[key] = errors[key][0];
    })
  }else {
    errors.forEach(({ field, Arraymessage }) => {
      errorMap[field] = Arraymessage[0];
    });
  }
  return errorMap;
};
