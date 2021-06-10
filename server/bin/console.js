const fs = require("fs/promises");


if (process.argv.length < 3) {
    console.log("Aucune commande spécifiée")
    process.exit();
}

const specifiedSplittedCommandName = process.argv[2].split(":");

const path = __dirname+"/commands/";

fs.readdir(path)
    .then(files => files.filter(file => file.endsWith(".js")))
    .then(files => files.map(file => require(path+file)))
    .then(commands => commands.filter(command => command.match(specifiedSplittedCommandName)))
    .then(foundCommands => {
        if (foundCommands.length > 1) {
            console.log("Nom de commande ambigus");
            return;
        }
        if (foundCommands.length === 0) {
            console.log("Aucune commande trouvée");
            return;
        }

        return foundCommands[0].start(process.argv);
    }).then(() => process.exit());
