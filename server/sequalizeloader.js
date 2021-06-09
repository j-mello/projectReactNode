const sequelize = require("./lib/sequelize");
const fs = require("fs/promises");

async function migrate() {
    const path = __dirname+"/models/sequelize/";
    const files = (await fs.readdir(path)).filter(file => file.endsWith(".js"));
    for (const file of files) {
        require(path+file);
    }
    return await sequelize.sync({alter:true});
}

module.exports = migrate;