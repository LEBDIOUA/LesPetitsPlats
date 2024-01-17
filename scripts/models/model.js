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
		// const linkExists = await this.verifierLien(url);

		// if (linkExists) {
		// 	this.data = await this.get(url);
		// } 
		// else {
		// 	this.data = await this.get('/Fisheye/data/photographers.json');
		// }
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
		// for (let i = 0; i < data.recipes.length; i++) {
		// 	recettes.push(new Recette(data.recipes[i]));
		// }
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
		const resultat = [];
		for (let i = 0; i < recettes.length; i++) {
			const recette = recettes[i];
			const nomRecette = recette.getName.toLowerCase();

			let trouve = nomRecette.search(motCle)>=0? true : false;
			if(!trouve){
				const descriptionRecette = recette.getDescription.toLowerCase();
				trouve = descriptionRecette.search(motCle)>=0? true : false
				if(!trouve){
					const ingredientsRecette = recette.getIngredients;
					let cpt = 0;
					do{
						const ingredient = ingredientsRecette[cpt].ingredient.toLowerCase();
						trouve = ingredient.search(motCle)>=0? true : false;
						cpt++
					}while(trouve && cpt===ingredientsRecette.length);
				}
			}
			if(trouve){
				resultat.push(recette);
			}
		}
		return resultat;
	}

	obtenirRecettesParIngredients(recettes, motsCles){
		let resultat = [];
		if(motsCles.length>0){
			for (let i = 0; i < recettes.length; i++) {
				const recette = recettes[i];
				const ingredientsRecette = recette.getIngredients;
				let trouve = false;
				let cpt = 0;
				do{
					for(let j=0; j<ingredientsRecette.length; j++){
						if(ingredientsRecette[j].ingredient.toLowerCase() === motsCles[cpt]){
							trouve = true;
							break;
						}
						else{
							trouve = false;
						}
					}
					cpt+=1;
				}while(cpt<motsCles.length && trouve);

				if(trouve){
					resultat.push(recette);
				}
			}
		}
		else{
			resultat = recettes;
		}
		return resultat;
	}

	obtenirRecettesParAppareils(recettes, motsCles){
		let resultat = [];
		if(motsCles.length>0){
			for (let i = 0; i < recettes.length; i++) {
				const recette = recettes[i];
				const appareilRecette = recette.getAppliance;
				let trouve = false;
				let cpt = 0;
				do{
					if(motsCles[cpt] === appareilRecette.toLowerCase()){
						trouve = true;
					}
					cpt+=1;
				}while(cpt<motsCles.length && trouve);

				if(trouve){
					resultat.push(recette);
				}
			}
		}
		else{
			resultat = recettes;
		}
		return resultat;
	}

	obtenirRecettesParUstensiles(recettes, motsCles){
		let resultat = [];
		if(motsCles.length>0){
			for (let i = 0; i < recettes.length; i++) {
				const recette = recettes[i];
				const ustensilesRecette = recette.getUstensils;
				let trouve = false;
				let cpt = 0;
				do{
					for(let j=0; j<ustensilesRecette.length; j++){
						if(ustensilesRecette[j].toLowerCase() === motsCles[cpt]){
							trouve = true;
							break;
						}
						else{
							trouve = false;
						}
					}
					cpt+=1;
				}while(cpt<motsCles.length && trouve);

				if(trouve){
					resultat.push(recette);
				}
			}
		}
		else{
			resultat = recettes;
		}
		return resultat;
	}
}
export default Model;
