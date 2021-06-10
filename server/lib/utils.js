exports.prettifyValidationErrors = (errors) =>
  Object.keys(errors).reduce((acc, err) => {
    acc[err] = errors[err].message;
    return acc;
  }, {});

exports.sendErrors = (res,req,e) => {
    console.error(e);
    res.status(500).json({
        errors: e.message === "Validation error" ? e.errors.map(error => error.message) : [e.message]
    });
}