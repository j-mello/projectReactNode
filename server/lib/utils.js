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

exports.generateRandomString = (n, forbiddenChars = []) => {
    const chars = "azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789$!?%&";
    let token = "";
    while (token.length < n) {
        const char = chars[rand(0,chars.length-1)];
        if (!forbiddenChars.includes(char))
            token += char;
    }
    return token;
}

exports.generateAccessToken = () => exports.generateRandomString(50, ['$','!','?','%','&'])

const rand = (a,b) => a+Math.floor(Math.random()*(b-a+1));
