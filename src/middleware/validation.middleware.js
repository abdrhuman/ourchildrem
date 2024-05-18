export const isValid = (schema) => {
  return (req, res, next) => {
    console.log('isValid!');
    const copyReq = { ...req.body, ...req.params, ...req.query };
    const validationResult = schema.validate(copyReq, { abortEarly: false });
    if (validationResult.error) {
      const messages = validationResult.error.details.map((error) => error.message);
      const error = new Error(messages.join(', ')); // تجميع الرسائل في رسالة واحدة
      error.cause = 400; // تعيين السبب لرمز الحالة 400
      return next(error);
    }
    return next()
  };
};
