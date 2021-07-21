const sequelize = require("./sequelize");
const fs = require("fs/promises");

async function migrate() {
    const path = __dirname+"/../models/sequelize/";
    const files = (await fs.readdir(path)).filter(file => file.endsWith(".js"));
    for (const file of files) {
        require(path+file);
    }
    return await sequelize.sync({alter:true});
}

async function drop() {
    const path = __dirname+"/../models/sequelize/";
    const models = (await fs.readdir(path)).filter(file => file.endsWith(".js")).map(file => require(path+file));
    await Promise.all(models.map(model => model.destroy({where:{}})))
}

module.exports = {migrate, drop};