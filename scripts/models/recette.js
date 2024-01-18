import Ingredient from './ingredient.js';
class Recette {
	constructor(recette) {
		this.id = recette.id;
		this.image = recette.image;
		this.name = recette.name;
		this.servings = recette.servings;
		this.ingredients = recette.ingredients.map(ingredient => new Ingredient(ingredient));
		this.time = recette.time;
		this.description = recette.description;
		this.appliance = recette.appliance;
		this.ustensils = recette.ustensils.slice();
	}

	get getImage() {
		return this.image;
	}

	get getName() {
		return this.name.trim();
	}

	get getServings() {
		return this.servings.trim();
	}

	get getIngredients() {
		return this.ingredients;
	}

	get getTime() {
		return this.time;
	}

	get getDescription() {
		return this.description.trim();
	}

	get getAppliance() {
		return this.appliance.trim();
	}

	get getUstensils() {
		const ustensilesSansEspaces = [];
		for (let i = 0; i < this.ustensils.length; i++) {
			ustensilesSansEspaces.push(this.ustensils[i].trim());
		}

		return ustensilesSansEspaces;
	}
}
export default Recette;
