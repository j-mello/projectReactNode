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
        unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numPhone: {
      type: DataTypes.STRING(13),
      allowNull: false
    },
  },
  {
    sequelize: conn,
    modelName: "User",
  }
);

const updatePassword = async (user) => {
    if (user._previousDataValues.password !== user.dataValues.password)
        user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
};

User.addHook("beforeCreate", updatePassword);
User.addHook("beforeUpdate", updatePassword);

module.exports = User;
