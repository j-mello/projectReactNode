# projectReactNode

## Commandes :
 - Créer un admin : docker-compose exec server_backoffice node bin/console.js admin:create -e admin@admin -p unMotDePasse -n 0606060606
 - Charger les fixtures : docker-compose exec server_backoffice node bin/console.js fixtures:load
 - Lancer le scrapping des devises : docker-compose exec server_backoffice node converterRate.js
 
## Parcours :
 - Créer un compte admin en invite de commande
 - S'inscrire sur le site du backoffice pour créer un compte marchand
 - Se connecter avec le compte admin
 - Valider le compte marchand
 - Se déconnecter pour se reconnecter avec le compte marchand précédemment validé
 - Une fois sur le compte marchand, aller dans 'informations' pour accéder/gérer les crédentials
 - Utiliser une paire client_id/client_secret pour se connecter depuis le site marchand 
