const {Model, DataTypes} = require("sequelize");
const conn = require("../../lib/sequelize");
const Seller = require("./Seller");

class Oauth2Token extends Model {}

Oauth2Token.init(
	{
		accessToken: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
		},
		expires: {
			type: DataTypes.DATE,
			allowNull: false
		}
	},
	{
		timestamps: false,
		sequelize: conn,
		modelName: "Oauth2Token",
	}
);

Oauth2Token.belongsTo(Seller);
Seller.hasMany(Oauth2Token);

module.exports = Oauth2Token;
