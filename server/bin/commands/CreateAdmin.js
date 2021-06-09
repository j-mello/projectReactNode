const Command = require("../../lib/Command")
const User = require("../../models/sequelize/User");

module.exports = class CreateAdmin extends Command {
    static commandName = "admin:create";
    static description = "Permet de créer un utilisateur";

    static argsModel = {
        email: { fields: ["-e","--email"], description: "L'adresse mail", type: "string" },
        password: { fields: ["-p","--password"], description: "Le mot de passe", type: "string" },
        numPhone : { fields: ["-n","--num-phone"], description: "Le numéro de téléphone", type: "string" }
    }

    static async action(args) {
        const user = new User(args);

        try {
            await user.save();
            console.log("Utilisateur créé avec succès!");
        } catch(e) {
            console.log("Echec de création de l'utilisateur : ");
            console.log(e.errors.map(error => error.message).join("\n"));
        }
    }

    static help() {
        console.log("Exemple : node bin/console.js "+this.commandName+" --email|-e unEmail@truc.com --password|-p unMotDePasse --num-phone|-n 0606060606");
    }
}