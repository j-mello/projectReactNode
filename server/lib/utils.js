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

exports.generateClientIdAndClientSecret = (n) => {
    const chars = "azertyuiopqsdfghjklmwxcvbn0123456789";
    let token = "";
    for (let i=0;i<n;i++) {
        token += chars[rand(0,chars.length-1)];
    }
    return token;
}

const rand = (a,b) => a+Math.floor(Math.random()*(b-a+1));
