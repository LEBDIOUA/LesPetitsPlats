import Model from '../models/model.js';
import RecettesView from '../views/recettesView.js';

class Controller {
	constructor() {
		this.model = Model.getInstance();
		this.recettesView = new RecettesView();
		this.ecouteurClick();
		this.observerModifications();
	}

	observerModifications() {
		// Un observateur qui actualise les recettes en appelant la méthode rechercherRecettes
		const observerMotsCles = new MutationObserver(() => {
			// Réduire toutes les listes
			const listes = document.querySelectorAll('nav .rechercheList');
			for (let i = 0; i < listes.length; i++) {
				this.reduireListe(listes[i]);
			}

			// Appeler la méthode rechercherRecettes
			this.rechercherRecettes();
		});
		// Configurer l'observateur afin d'observer les noeuds enfants
		const motsClesConfig = {childList: true};
		observerMotsCles.observe(document.querySelector('.motsCles'), motsClesConfig);
	}

	async afficherRecettes() {
		const recettes = await this.model.obtenirRecettes();
		this.recettesView.afficherRecettes(recettes);
	}

	ecouteurClick() {
		// Effectuer une recherche générale après chaque modification dans l'input, à condition qu'il y ait plus de 2 caractères saisis.
		const textARechercher = document.querySelector('.entete .rechercheBar');
		textARechercher.addEventListener('input', () => {
			if (textARechercher.value.length >= 3) {
				this.rechercherRecettes();
			} else {
				const motsCles = document.querySelectorAll('.motCle');
				this.rechercherRecettes('sansMotCleGlobal');
			}
		});

		// Programmer l'événement click pour ouvrir ou réduire les listes.
		const titresListes = document.querySelectorAll('nav .titre');
		for (let i = 0; i < titresListes.length; i++) {
			titresListes[i].addEventListener('click', () => {
				const id = '#' + titresListes[i].getAttribute('id') + 'Liste';
				const ulElement = document.querySelector(id);
				this.controlerListe(ulElement);
			});
		}

		// Afficher l'icône X et le supprimer à chaque modification dans le champ input.
		const motARechercher = document.querySelector('nav .rechercheBar .aRechercher');
		const iconSupprimerInput = document.querySelector('nav .rechercheBar .iconSupprimer');
		motARechercher.addEventListener('input', () => {
			const nbCaracteres = motARechercher.value.length;
			if (nbCaracteres === 0 && iconSupprimerInput.classList.contains('affiche')) {
				iconSupprimerInput.classList.replace('affiche', 'cache');
				this.chargerListe();
			} else {
				iconSupprimerInput.classList.replace('cache', 'affiche');
			}
		});

		// Programmer l'événement click pour rechercher un mot dans la liste et programmer l'événement click pour supprimer le mot saisi.
		const btnRechercher = motARechercher.parentNode.querySelector('.iconRecherche');
		btnRechercher.addEventListener('click', this.rechercherDansListe.bind(this));
		iconSupprimerInput.addEventListener('click', () => {
			motARechercher.value = '';
			iconSupprimerInput.classList.replace('affiche', 'cache');
			motARechercher.focus();
			this.chargerListe();
		});
	}

	chargerListe() {
		/* Récupérer le nom de la liste à charger, mettre la première lettre en majuscule,
		puis construire et générer une fonction portant le nom 'chargerListe' suivi du nom de la liste.*/
		const motARechercher = document.querySelector('nav .rechercheBar .aRechercher');
		const nomListe = document.querySelectorAll('nav ul')[motARechercher.parentNode.classList[1].substr(8) - 1].getAttribute('id');
		let nomSansListe = nomListe.substr(0, nomListe.length - 5);
		nomSansListe = nomSansListe[0].toUpperCase() + nomSansListe.substr(1);
		const nomFonction = 'chargerListe' + nomSansListe;
		this.recettesView[nomFonction]();
	}

	rechercherDansListe() {
		/* Cette fonction permet d'actualiser la liste soit Ingrédients, Appareils ou Ustensiles, 
		afin de mettre en haut de la liste les mots contenant les caractères recherchés.*/
		const motARechercher = document.querySelector('nav .rechercheBar .aRechercher');
		const liste = document.querySelectorAll('nav ul')[motARechercher.parentNode.classList[1].substr(8) - 1];
		this.recettesView.actualiserListe(liste, motARechercher.value);
	}

	async rechercherRecettes(sansMotCleGlobal) {
		let textARechercher = '';
		if (sansMotCleGlobal === undefined) {
			textARechercher = document.querySelector('.entete .rechercheBar').value;
		}

		const ingrediends = Array.from(document.querySelectorAll('.motsCles .ingredient'), ingredient => ingredient.textContent.trim().toLowerCase());
		const appareils = Array.from(document.querySelectorAll('.motsCles .appareil'), appareil => appareil.textContent.trim().toLowerCase());
		const ustensiles = Array.from(document.querySelectorAll('.motsCles .ustensile'), ustensile => ustensile.textContent.trim().toLowerCase());

		const recettes = await this.model.rechercherRecettes(textARechercher, ingrediends, appareils, ustensiles);
		this.recettesView.afficherRecettes(recettes);
	}

	controlerListe(ulListe) {
		if (ulListe.classList.contains('reduit')) {
			this.developperListe(ulListe);
		} else {
			this.reduireListe(ulListe);
		}
	}

	developperListe(ulListe) {
		const indexListeADevelopper = parseInt(ulListe.getAttribute('data-id'), 10);
		// Fermer les autres listes
		const autresListes = document.querySelectorAll('nav .rechercheList');
		for (let i = 0; i < autresListes.length; i++) {
			if (indexListeADevelopper !== i) {
				this.reduireListe(autresListes[i]);
			}
		}

		// Affecter Position 1 ou 2 ou 3 selon la liste développée afin de déplacer la barre de recherche
		const anciennePosition = document.querySelector('nav .rechercheBar').classList;
		document.querySelector('nav .rechercheBar').classList.replace(anciennePosition[1], `position${indexListeADevelopper + 1}`);
		document.querySelector('nav .rechercheBar').classList.replace('cache', 'affiche');

		const titre = document.querySelectorAll('nav .titre')[indexListeADevelopper];
		ulListe.classList.replace('reduit', 'ouvert');
		titre.classList.add('listeOuverte');
		titre.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
		document.querySelector('nav .aRechercher').focus();
	}

	reduireListe(ulListe) {
		const index = parseInt(ulListe.getAttribute('data-id'), 10);
		document.querySelector('nav .rechercheBar').classList.replace('affiche', 'cache');
		ulListe.classList.replace('ouvert', 'reduit');
		const titre = document.querySelectorAll('nav .titre')[index];
		titre.classList.remove('listeOuverte');
		titre.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
	}
}
export default Controller;
