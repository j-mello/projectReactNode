const { Model, DataTypes } = require("sequelize");
const conn = require("../../lib/sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {}

User.init(
  {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: conn,
    modelName: "User",
  }
);

const updatePassword = async (user) => {
  user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
};
User.addHook("beforeCreate", updatePassword);
User.addHook("beforeUpdate", updatePassword);

module.exports = User;
