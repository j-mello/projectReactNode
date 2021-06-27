const ClientCredential = require("../models/sequelize/ClientCredential");
const Oauth2Token = require("../models/sequelize/Oauth2Token");
const Seller = require("../models/sequelize/Seller");
const oAuth2Server = require("node-oauth2-server");

const model = {
    getClient: function (clientId,clientSecret,callback) {
        return ClientCredential.findOne({
            where: {clientId,clientSecret}
        }).then(clientCredential => {
            console.log({clientCredential});
            callback(null,clientCredential != null && {id: clientId, grants: null})
        });
    },
    getAccessToken: function (accessToken,callback) {
        return Oauth2Token.findOne({
            where: { accessToken }
        }).then(oauth2Token => callback(null, oauth2Token != null && {
            ...oauth2Token.dataValues,
            client: {
                id: oauth2Token.ClientCredentialClientId
            }
        }));
    },
    saveAccessToken: function (accessToken,clientId,expires,seller,callback) {
        return new Oauth2Token({accessToken, expires, ClientCredentialClientId: clientId}).save()
            .then(oauth2Token => callback(null,{
                ...oauth2Token,
                client: {id: clientId},
                user: false
            }));
    },
    getUserFromClient: function (clientId,clientSecret,callback) {
        ClientCredential.findOne({
            where: {clientId, clientSecret},
            include: Seller
        }).then(clientCredential => callback(null,clientCredential != null && clientCredential.Seller.dataValues))
    },
    grantTypeAllowed: function (clientId,grantType,callback) {
        callback(null,true)
    }
}

module.exports = oAuth2Server({
    model: model,
    grants: ['client_credentials'],
    debug: true
})