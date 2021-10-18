export const toErrorMap = (errors: any) => {
  const errorMap = {};

  errors.forEach(({ field, Arraymessage }) => {
    errorMap[field] = Arraymessage[0];
  });
  return errorMap;
};
