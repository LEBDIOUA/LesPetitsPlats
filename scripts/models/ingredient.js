
class Ingredient {
	constructor(ingredient) {
		this.ingredient = ingredient.ingredient;
		this.quantity = ingredient.quantity;
		this.unit = ingredient.unit;
	}

	get getIngredient() {
		return this.ingredient.trim();
	}

	get getQuantityUnit() {
		const unitValeur = this.unit ? this.unit : '';
		const quantityValeur = this.quantity ? this.quantity.toString() + ' ' : '';
		return quantityValeur + unitValeur;
	}
}
export default Ingredient;
