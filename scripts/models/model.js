import Recette from './recette.js';
class Model {
	static instance = null;

	static getInstance() {
		if (this.instance === null) {
			this.instance = new Model();
		}

		return (this.instance);
	}

	get(url) {
		return fetch(url)
			.then(httpBodyResponse => {
				const response = httpBodyResponse.json();
				return response;
			})
			.catch(error => {
				// Gestion basique des erreurs.
				console.log('Une erreur s\'est produite :');
				console.log(error);
			});
	}

	async getData() {
		const url = '../data/recipes.json';
		this.data = await this.get(url);
		const linkExists = await this.verifierLien(url);

		if (linkExists) {
			this.data = await this.get(url);
		} 
		else {
			this.data = await this.get('/LesPetitsPlats/data/photographers.json');
		}
		return this.data;
	}

	async verifierLien(url) {
		try {
			const response = await fetch(url);
			return response.ok;
		} catch (error) {
			console.error('Erreur lors de la vérification du lien :', error);
			return false;
		}
	}

	async obtenirRecettes() {
		const data = await this.getData();
		const recettes = data.recipes.map(recette => new Recette(recette));
		return recettes;
	}

	async rechercherRecettes(texte, ingredients, appareils, ustensiles){
		let recettes = await this.obtenirRecettes();
		recettes = this.obtenirRecettesParTexte(recettes, texte);
		recettes = this.obtenirRecettesParIngredients(recettes, ingredients);
		recettes = this.obtenirRecettesParAppareils(recettes, appareils);
		recettes = this.obtenirRecettesParUstensiles(recettes, ustensiles);
		return recettes;
	}

	obtenirRecettesParTexte(recettes, motCle){
		let resultat = recettes.filter(recette =>
			recette.getName.toLowerCase().includes(motCle) ||
			recette.getDescription.toLowerCase().includes(motCle)
		);
		if (resultat.length === 0) {
			resultat = recettes.filter(recette => {
				recette.getIngredients.map(ingredients => 
					ingredients.ingredient.toLowerCase().includes(motCle))
			});
		}
		return resultat;
	}

	obtenirRecettesParIngredients(recettes, motsCles){
		let resultat = [];
		if(motsCles.length>0){
			/*recettes.some(recette => {
				const ingredientsTrouves = recette.getIngredients.filter(ingredient =>
					motsCles.includes(ingredient.getIngredient.toLowerCase())
				);
		
				if (ingredientsTrouves.length === motsCles.length) {
					resultat.push(recette);
				}
			});*/

			/*Un algorithme qui évite de continuer à parcourir le reste des ingrédients 
			si, par exemple, on a 3 mots cles à trouver et il ne reste que 2 ingredients*/
			recettes.some(recette => {
				const ingredientsTrouves = [];
				for(let i=0; i<recette.getIngredients.length; i++){
					const ingredient = recette.getIngredients[i].getIngredient.toLowerCase();
					if(motsCles.includes(ingredient)){
						ingredientsTrouves.push(ingredient);
					}
					if(ingredientsTrouves.length === motsCles.length || i > recette.getIngredients.length - motsCles.length ){
						break;
					}
				}
			
				if (ingredientsTrouves.length === motsCles.length) {
					resultat.push(recette);
					return false
				}
			});
		}
		else{
			resultat = recettes;
		}

		return resultat;
	}

	obtenirRecettesParAppareils(recettes, motsCles){
		let resultat = [];
		if(motsCles.length>0){
			resultat = recettes.filter(recette =>
				motsCles.includes(recette.getAppliance.toLowerCase())
			)
		}
		else{
			resultat = recettes;
		}
		return resultat;
	}

	obtenirRecettesParUstensiles(recettes, motsCles){
		let resultat = [];
		if(motsCles.length>0){
			recettes.some(recette => {
				const ustensilesTrouves = [];
				for(let i=0; i<recette.getUstensiles.length; i++){
					const ustensile = recette.getUstensiles[i].toLowerCase();
					if(motsCles.includes(ustensile)){
						ustensilesTrouves.push(ustensile);
					}
					if(ustensilesTrouves.length === motsCles.length || i > recette.getUstensiles.length - motsCles.length ){
						break;
					}
				}
			
				if (ustensilesTrouves.length === motsCles.length) {
					resultat.push(recette);
					return false
				}
			});
		}
		else{
			resultat = recettes;
		}
		return resultat;
	}
}
export default Model;
