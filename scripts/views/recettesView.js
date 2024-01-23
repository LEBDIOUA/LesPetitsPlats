
class RecettesView {
	constructor() {
		this.recettes = document.querySelector('.recettes');
		this.listeRecettes = null;
	}

	construireRecette(recette) {
		let content = `
			<article class='recette'>
                <div class='temps'>${recette.getTime}min</div>
				<img src='assets/Photos/${recette.getImage}' title='Photo de ${recette.getImage}' alt='${recette.getImage}'>
                <div class='content'>
                    <h2>${recette.getName}</h2>
                    <h3>Recette</h3>
                    <p class='description'>${recette.getDescription}</p>
                    <h3>Ingrédients</h3>
                    <div class='ingredients'>
		`;
		for (let i = 0; i < recette.getIngredients.length; i++) {
			content += `
                    <div class='ingredient'>
                        <h4>${recette.getIngredients[i].getIngredient}</h4>
                        <p>${recette.getIngredients[i].getQuantityUnit}</p>
                    </div>
		    `;
		}

		content += '</div></div></article>';
		this.recettes.innerHTML += content;
	}

	afficherListe(liste, titre) {
		const ulElement = document.querySelector(`nav #${titre}`);
		ulElement.innerHTML = '';
		const id = titre.substr(0, titre.length - 6);
		for (let i = 0; i < liste.length; i++) {
			const liElement = document.createElement('li');
			liElement.setAttribute('role', 'option');
			liElement.setAttribute('class', id);
			liElement.textContent = liste[i];
			ulElement.appendChild(liElement);
			liElement.addEventListener('click', () => {
				this.ajouterMotCle(liElement);
			});
		}
	}

	afficherRecettes(recettes) {
		const info = document.querySelector('main .info');
		if (recettes.length === 0) {
			this.recettes.classList.replace('plein', 'vide');
			info.classList.replace('cache', 'affiche');
		} else {
			this.recettes.classList.replace('vide', 'plein');
			info.classList.replace('affiche', 'cache');
			this.recettes.innerHTML = '';
			for (let i = 0; i < recettes.length; i++) {
				this.construireRecette(recettes[i]);
			}

			this.listeRecettes = recettes;
			this.chargerListeIngredients();
			this.chargerListeAppareils();
			this.chargerListeUstensiles();

			document.querySelector('.sectionRecherche .nbRecettes').textContent = `${recettes.length} recettes`;
		}
	}

	chargerListeIngredients() {
		const liste = [];
		for (let i = 0; i < this.listeRecettes.length; i++) {
			const ingredients = this.listeRecettes[i].getIngredients;
			for (let j = 0; j < ingredients.length; j++) {
				const {ingredient} = ingredients[j];
				if (!liste.some(item => item.toLowerCase() === ingredient.toLowerCase())) {
					liste.push(ingredient);
				}
			}
		}

		this.afficherListe(liste, 'ingredientsListe');
	}

	chargerListeAppareils() {
		const liste = [];
		for (let i = 0; i < this.listeRecettes.length; i++) {
			const appareil = this.listeRecettes[i].getAppliance;
			if (!liste.some(item => item.toLowerCase() === appareil.toLowerCase())) {
				liste.push(appareil);
			}
		}

		this.afficherListe(liste, 'appareilsListe');
	}

	chargerListeUstensiles() {
		const liste = [];
		for (let i = 0; i < this.listeRecettes.length; i++) {
			const ustensiles = this.listeRecettes[i].getUstensils;
			for (let j = 0; j < ustensiles.length; j++) {
				const ustensile = this.listeRecettes[i].getUstensils[j];
				if (!liste.some(item => item.toLowerCase() === ustensile.toLowerCase())) {
					liste.push(ustensile);
				}
			}
		}

		this.afficherListe(liste, 'ustensilesListe');
	}

	ajouterMotCle(mot) {
		const conteneurMotsCles = document.querySelector('.motsCles');
		const motsCles = document.querySelectorAll('.motsCles .motCle');
		let trouve = false;
		for (let i = 0; i < motsCles.length; i++) {
			if (mot.textContent.trim() === motsCles[i].textContent.trim()) {
				trouve = true;
				break;
			}
		}

		if (!trouve) {
			const content = `<div class='motCle ${mot.getAttribute('class')}'>${mot.textContent} <i class="fa-solid fa-xmark"></i><i class="fa-solid fa-circle-xmark"></i></div>`;
			conteneurMotsCles.innerHTML += content;
			this.ecouterClicSupprimerMotCle();
			document.querySelector('nav .aRechercher').value = '';
		}
	}

	ecouterClicSupprimerMotCle() {
		// Click pour supprimer les mots pour la recherche spécifique
		const iconsMotsCles = document.querySelectorAll('.motsCles .fa-circle-xmark');
		iconsMotsCles.forEach(icon => {
			icon.addEventListener('click', () => {
				const motCle = icon.parentNode;
				this.supprimerMotCle(motCle);
			});
		});
	}

	supprimerMotCle(motCle) {
		const motsCles = document.querySelector('.motsCles');
		motsCles.removeChild(motCle);
	}

	actualiserListe(liste, motARechercher) {
		const nouveauListe = [];
		const liElements = liste.querySelectorAll('li');
		liElements.forEach(liElement => {
			const li = liElement.textContent.toLowerCase();
			if (li.indexOf(motARechercher.toLowerCase()) >= 0) {
				nouveauListe.push(liElement.textContent);
			}
		});
		this.afficherListe(nouveauListe, liste.getAttribute('id'));
	}
}
export default RecettesView;
