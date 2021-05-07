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
|
### Contraintes techniques
* Utilisation d'un serveur NodeJS, du framework Express, d'une DB MongoDB et du plug-in Mongoose;
* Toute erreur doit être renvoyée telle quelle, sans aucune modification ni ajout;
* La sécurité de l'accès à la base doit permettre au validateur de lancer l'application depuis sa machine.
## Livrables
* Le lien vers un dépôt Git public contenant le code de l'API.
## Comment utiliser ce dépôt
### Partie Frontend
* URL du repository GitHub contenant le frontend : https://github.com/OpenClassrooms-Student-Center/dwj-projet6
* Nécessite Angular CLI V.7.0.2;
* Exécuter 'npm install';
* Installer node-sass à part;
* Exécuter 'ng serve' et aller sur 'http://localhost:4200/'.
### Partie Backend