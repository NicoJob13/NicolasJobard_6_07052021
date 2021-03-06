# NicolasJobard_6_07052021
Projet 6 de la formation Développeur Web d'OpenClassrooms.
## Intitulé du projet
Construisez une API sécurisée pour une application d'avis gastronomiques.
## Scénario du projet
* En tant que développeur backend freelance, créer pour So Pekocko, marque créant des sauces piquantes, en respectant la note de cadrage, le MVP d'une application d'évaluation de ses sauces, appelée "Piquante" et permettant aux utilisateurs d’ajouter leurs sauces préférées et de liker ou disliker les sauces ajoutées par les autres utilisateurs (la partie frontend de l'application est fournie).
* Présenter l'application au product owner.
## Objectifs
* Implémenter un modèle logique de données conformément à la réglementation;
* Stocker des données de manière sécurisée;
* Mettre en oeuvre des opérations CRUD de manière sécurisée.
## Cadrage du projet
### Exigences de sécurité
* Masquage des données personnelles des utilisateurs coté API comme DB;
* Mots de passe chiffrés et stockés de manière sécurisée;
* Adresses mails de la base de données uniques et un plugin Mongoose approprié est utilisé pour s’en assurer et rapporter des erreurs le cas échéant;
* Authentification renforcée sur les routes requises (les routes relatives à la sauce doivent exiger une demande authentifiée (contenant un jeton valide dans son en-tête d'autorisation : "Bearer <token>"));
* 2 types de droits administrateur à la base de données :
    * un accès pour supprimer ou modifier des tables,
    * un accès pour éditer le contenu de la base;
* Respect du RGPD et des standards OWASP.
### Modèles de données à respecter
* Sauce :
    * id: ObjectID — identifiant unique créé par MongoDB,
    * userId: string — identifiant unique MongoDB pour l'utilisateur qui a créé la sauce,
    * name: string — nom de la sauce,
    * manufacturer: string — fabricant de la sauce,
    * description: string — description de la sauce,
    * mainPepper: string — principal ingrédient dans la sauce,
    * imageUrl: string — string de l'image de la sauce téléchargée par l'utilisateur,
    * heat: number — nombre entre 1 et 10 décrivant la sauce,
    * likes: number — nombre d'utilisateurs qui aiment la sauce,
    * dislikes: number — nombre d'utilisateurs qui n'aiment pas la sauce,
    * usersLiked: [string] — tableau d'identifiants d'utilisateurs ayant aimé la sauce,
    * usersDisliked: [string] — tableau d'identifiants d'utilisateurs n'ayant pas aimé la sauce;
* Utilisateur :
    * userId: string — identifiant unique MongoDB pour l'utilisateur qui a créé la sauce,
    * email: string — adresse électronique de l'utilisateur [unique],
    * password: string — hachage du mot de passe de l'utilisateur.
### Guidelines
| Verb | Paramètres | Corps de la demande | Type de réponse attendu | Fonction |
| :--: | :--------: | :------------------: | :----------------------: | :-------: |
| POST | /api/auth/signup | { email: string, password: string } | { message: string } | Chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base de données |
| POST | /api/auth/login | { email: string, password: string } | userId: string, token: string } | Vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis la base de données et un jeton Web JSON signé (contenant également l'identifiant userID) |
| GET | /api/sauces | Non demandé | Tableau des sauces | Renvoie le tableau de toutes les sauces dans la base de données |
| GET | /api/sauces/:id | Non demandé | Sauce unique | Renvoie la sauce avec l'ID fourni |
| POST | /api/sauces | { sauce : Chaîne, image : Fichier } | { message: Chaîne } | Capture et enregistre l'image, analyse la sauce en utilisant une chaîne de caractères et l'enregistre dans la base de données, en définissant correctement son image URL. Remet les sauces aimées et celles détestées à 0, et les sauces usersliked et celles usersdisliked aux tableaux vides. |
| PUT | /api/sauces/:id | SOIT Sauce comme JSON OU { sauce : Chaîne, image : Fichier } | { message: Chaîne } | Met à jour la sauce avec l'identifiant fourni. Si une image est téléchargée, capturez-la et mettez à jour l'image URL des sauces. Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le corps de la demande (req.body.name, req.body.heat etc). Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce. |
| DELETE | /api/sauces/:id | Non demandé | { message: Chaîne } | Supprime la sauce avec l'ID fourni. |
| POST | /api/sauces/:id/like | { userId: Chaîne, j'aime : Nombre } | { message: Chaîne } | Définit le statut "j'aime" pour userID fourni. Si j'aime = 1, l'utilisateur aime la sauce. Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas. Si j'aime = -1, l'utilisateur n'aime pas la sauce. L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié, en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois. Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime". |
### Contraintes techniques
* Utilisation d'un serveur NodeJS, du framework Express, d'une DB MongoDB et du plug-in Mongoose;
* Toute erreur doit être renvoyée telle quelle, sans aucune modification ni ajout;
* La sécurité de l'accès à la base doit permettre au validateur de lancer l'application depuis sa machine.
## Livrables
* Le lien vers un dépôt Git public contenant le code de l'API.
## Comment utiliser ce dépôt
* S'assurer au préalable de disposer de node.js sur le poste, sinon le télécharger (https://nodejs.org/) puis l'installer;
### Partie Backend
* Sur MongoDB (https://www.mongodb.com/) créer un compte, un cluster, une base de données et un utilisateur ayant des droits de lecture et écriture; 
* Ouvrir le dossier 'Backend' du projet dans son IDE;
* Ouvrir un terminal et suivre les étapes d'installation suivantes :
    * npm install (qui installe les dépendances du projet),
    * créer un fichier '.env' afin d'y renseigner les variables d'environnement suivantes, correspondant aux informations de la base de données MongoDB :
        * DB_CLUST=Le nom de votre cluster
        * DB_NAME=La nom de la base
        * DB_USER=Le nom d'utilisateur
        * DB_PASS=Le mot de passe associé à l'utilisateur
* Exécuter 'nodemon server' : les messages 'Listening on port 3000' et 'Connexion à MongoDB réussie' doivent apparaître;
### Partie Frontend
* Ouvrir le dossier 'Frontend' dans son IDE;
* Ouvrir un terminal et suivre les étapes d'installation suivantes :
    * npm install -g @angular/cli (installe le client angular permettant d'utiliser 'ng'),
    * npm install (qui installe les dépendances du projet);
* Exécuter 'ng serve' (ou 'npm start');
* Une fois la compilation effectuée, ouvrir un navigateur et aller sur 'http://localhost:4200/'.