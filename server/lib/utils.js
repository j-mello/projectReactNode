exports.prettifyValidationErrors = (errors) =>
  Object.keys(errors).reduce((acc, err) => {
    acc[err] = errors[err].message;
    return acc;
  }, {});

exports.sendErrors = (req,res,e) => {
    console.error(e);
    res.status(e.message === "Validation error" || e.name === "SequelizeValidationError" ? 400 : 500).json({
        errors: e.errors ? e.errors.map(error => error.message) : [e.message]
    });
}