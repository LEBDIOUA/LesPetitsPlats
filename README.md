![Les-petits-plats](https://github.com/LEBDIOUA/LesPetitsPlats/assets/141866412/08d87323-01e5-4843-90d2-8323525faa00)

Le projet a été développé pour l'un des sites les plus importants dédiés aux recettes de cuisine. L'objectif principal était d'intégrer un moteur de recherche performant au sein de leur plateforme, un moteur de recherche qui positionnerait leur site en tant que leader, offrant une expérience utilisateur plus solide et améliorée par rapport à d'autres sites du même domaine.
Le site propose deux types de recherches : une recherche générale qui examine le nom, la description et les ingrédients de la recette, ainsi qu'une recherche spécifique qui cible spécifiquement les ingrédients, les appareils ou les ustensiles. Cette approche permet aux utilisateurs de trouver rapidement et efficacement les recettes qui correspondent à leurs besoins, renforçant ainsi la qualité de l'expérience utilisateur sur le site.

## Modèle de Données : Recette et Ingrédient

![modele-de-donnees](https://github.com/LEBDIOUA/LesPetitsPlats/assets/141866412/3b258974-1734-49ca-aa68-8f7cefeb43ab)
Lors de la création de classes pour le projet, j’ai choisi d'avoir deux classes distinctes, une pour Recette et une pour Ingredient, dans le but d’adopter une approche logique et bien structurée. Cette approche garantit la séparation des responsabilités, où chaque classe a un rôle bien défini, rendant ainsi le code plus lisible, maintenable et évolutif. De plus elle facilite l'ajout de fonctionnalités supplémentaires à l'avenir.

## Model View Controller

L'approche MVC contribue à une organisation plus efficace du code, à une meilleure lisibilité et simplifie la maintenance. Elle favorise la réutilisation du code, facilite la collaboration, et offre une évolutivité et une flexibilité considérables. Par exemple, une modification de l'aspect visuel n'impacte pas nécessairement le modèle ou le contrôleur. C'est pourquoi j'ai opté pour l'architecture MVC.
![mvc](https://github.com/LEBDIOUA/LesPetitsPlats/assets/141866412/741b29ba-1fae-48bb-a84f-e145794191ab)
En plus de mes deux classes mentionnées précédemment, j'ai créé une classe Model dans le dossier Model. Cette classe facilite la connexion aux données et récupère à la fois l'ensemble des recettes ainsi que les résultats de recherche après une requête.
Dans mon dossier View, on trouve la classe RecettesView qui offre l'affichage des données à l'utilisateur. Cette classe remplit les listes (ingrédients, appareils et ustensiles), ajoute dans un conteneur les mots-clés choisis par l'utilisateur ou les efface. De plus, elle actualise les listes après chaque requête, étant donné que les listes sont remplies à partir des informations des recettes affichées.
Dans le dossier Controller, qui assure la communication entre la View et le Model, on trouve des méthodes qui écoutent les clics, par exemple, pour développer ou ouvrir les listes. Il y a également un observateur qui permet de surveiller les éléments enfants du conteneur mentionné précédemment afin de relancer la recherche.

## Observateur - MutationObserver

L'ajout d'un observateur n'était pas requis initialement. C'était un défi que j'avais choisi de relever.
![observateur](https://github.com/LEBDIOUA/LesPetitsPlats/assets/141866412/73096570-0d5a-415a-9f4c-914bc5227b6a)

## Algorithme de Recherche - Approche Fonctionnelle

Conformément à la demande, j'ai développé la partie recherche en utilisant deux algorithmes. Bien que les deux aient le même objectif global, qui est de rechercher des recettes en fonction d'un mot-clé donné, leurs approches diffèrent en termes de méthodes et d'étapes spécifiques.
Dans cette branche, vous trouverez l'algorithme avec l'Approche Fonctionnelle.

![Approche-Fonctionnelle](https://github.com/LEBDIOUA/LesPetitsPlats/assets/141866412/9741ff5b-9734-4d02-9f65-a0e0efe75c2c)

Dans cet algorithme, je me suis basé sur l'approche fonctionnelle en utilisant des méthodes telles que filter, map et some.
Une fois que l'utilisateur saisit une valeur, le contrôleur récupère toutes les recettes et vérifie la taille de cette valeur. Si elle est de 3 caractères ou plus, on filtre la liste en vérifiant si le nom, la description ou les ingrédients de chaque instance incluent la valeur saisie. Si c'est le cas, on stocke la recette dans une autre liste, et à la fin, on remplace la première liste par la dernière. Ensuite, on vérifie l'existence des autres mots-clés choisis dans les listes. S'il y a des mots-clés, on passe à la recherche spécifique dans les ingrédients, les appareils et les ustensiles, et on remplace à chaque fois la liste précédente par la nouvelle liste obtenue.
Si la recherche est positive, c'est-à-dire si elle me donne au moins une recette, j'affiche le résultat. Sinon, j'affiche un message informant l'utilisateur qu'il n'y a aucune recette avec ce mot-clé.

## Les avantages de cette approche
        * Approche fonctionnelle moderne.
        * Code concis et lisible.
        * Performances potentiellement optimisées pour des ensembles de données de taille variable.

## Les inconvénients de cette approche
        * Peut nécessiter une compréhension plus avancée des méthodes fonctionnelles pour certains développeurs.

## Choix entre les deux algorithmes
Afin de choisir un entre les deux algorithmes, j’ai utilisé JSBench pour comparer entre les deux, au niveau de nombre d’opérations effectuées, la vitesse d’exécution et aussi une estimation de l'erreur standard avec ± et le pourcentage d'incertitude.

![Comparaison-Algorithmes](https://github.com/LEBDIOUA/LesPetitsPlats/assets/141866412/6ac0faac-0265-4b6e-8fd5-1730a9180050)

D'après les résultats du comparateur JSBench, l'Approche Fonctionnelle semble avoir obtenu de meilleures performances que l'Approche Traditionnelle, avec une vitesse d'exécution de 32 000 opérations par seconde, soit 58.46% plus rapide que l'Approche Traditionnelle qui a enregistré 13 000 opérations par seconde.

![Algorithme-Vainqueur](https://github.com/LEBDIOUA/LesPetitsPlats/assets/141866412/b7bb612a-e2a1-40a4-aada-c57523d63c80)

