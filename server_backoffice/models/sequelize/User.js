const { Model, DataTypes } = require("sequelize");
const conn = require("../../lib/sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numPhone: {
      type: DataTypes.STRING(13),
      allowNull: false
    }
  },
  {
    sequelize: conn,
    modelName: "User",
  }
);

const updatePassword = async (user) => {
    if ((user.type === "BULKUPDATE" && user.fields.includes('password')) ||
        (user.type === undefined && user._previousDataValues.password !== user.dataValues.password)) {

        const attributes = user.type === "BULKUPDATE" ? user.attributes : user;
        attributes.password = await bcrypt.hash(attributes.password, await bcrypt.genSalt());
    }
};

User.addHook("beforeCreate", updatePassword);
User.addHook("beforeBulkUpdate", updatePassword);
User.addHook("beforeUpdate", updatePassword);

module.exports = User;
