exports.prettifyValidationErrors = (errors) =>
  Object.keys(errors).reduce((acc, err) => {
    acc[err] = errors[err].message;
    return acc;
  }, {});