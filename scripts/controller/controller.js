import Model from '../models/model.js';
import RecettesView from '../views/recettesView.js';

class Controller {
	constructor() {
		this.model = Model.getInstance();
		this.recettesView = new RecettesView();
		this.ecouteurClic();
		this.observerModifications();
	}

	observerModifications(){
		//un observateur qui actualise les recettes en appelant la méthode rechercherRecettes 
		const observerMotsCles = new MutationObserver(() => {
			//Réduire toutes les listex
			const listes = document.querySelectorAll('nav .rechercheList');
			for(let i=0; i<listes.length; i++){
				this.reduireListe(listes[i]);
			}
			//Appeler la méthode rechercherRecettes
			this.rechercherRecettes(); 
		});
		//configurer l'observateur afin d'observer les noeuds enfants
		const motsClesConfig = { childList: true };
		observerMotsCles.observe(document.querySelector('.motsCles'), motsClesConfig);

		// const observerInputEntete = new MutationObserver((mutationsList) => {
		// 	mutationsList.forEach((mutation) => {
		// 		if (mutation.target.value.length >= 3) {
		// 			this.rechercherRecettes();
		// 		}
		// 	});
		// });
		// const inputEnteteConfig = { attributes: true, childList: false, subtree: false };
		// observerInputEntete.observe(document.querySelector('.rechercheBar'), inputEnteteConfig);
	}

	async afficherRecettes() {
		const recettes = await this.model.obtenirRecettes();
		this.recettesView.afficher(recettes);
	}

	ecouteurClic(){
		//Faire la recherche générale apres chaque modification dans l'input à condition qu'il y a plus de 2 caractères saisis
		const textARechercher = document.querySelector('.entete .rechercheBar');		
		textARechercher.addEventListener('input', () => {
			if(textARechercher.value.length >=3){
				this.rechercherRecettes();
			}
			else{
				this.afficherRecettes();
			}
		});
		
		//click pour ouvrir ou reduire les  listes
        const titresListes = document.querySelectorAll('nav .titre');
		for(let i=0; i<titresListes.length; i++){
			titresListes[i].addEventListener('click', () => {
				const id = '#'+titresListes[i].getAttribute('id')+'Liste';
				const ulElement = document.querySelector(id);
				this.controlerListe(ulElement); 
			});
		}

		//Afficher X ou la supprimer à chaque modification dans le champ input
		const motARechercher = document.querySelector('nav .rechercheBar .aRechercher');
		const iconSupprimerInput = document.querySelector('nav .rechercheBar .iconSupprimer');
		motARechercher.addEventListener('input', () => {
			const nbCaracteres = motARechercher.value.length;
			if(nbCaracteres === 0 && iconSupprimerInput.classList.contains('affiche')){
				iconSupprimerInput.classList.replace("affiche", "cache");
				this.rechargerListe();
			}
			else{
				iconSupprimerInput.classList.replace("cache", "affiche");
			}
		});

		//Click pour supprimer le mot saisie
		const btnRechercher = motARechercher.parentNode.querySelector('.iconRecherche');
		btnRechercher.addEventListener('click', this.rechercherDansListe.bind(this)); 
		iconSupprimerInput.addEventListener('click', () => {
			motARechercher.value = '';
			motARechercher.focus();
			this.rechargerListe();
		});		
	}

	rechargerListe(){
		const motARechercher = document.querySelector('nav .rechercheBar .aRechercher');
		const nomListe = document.querySelectorAll('nav ul')[motARechercher.parentNode.classList[1].substr(8)-1].getAttribute('id');
		let nomSansListe = nomListe.substr(0, nomListe.length-5);
		nomSansListe = nomSansListe[0].toUpperCase()+nomSansListe.substr(1);
		const nomFonction = 'chargerListe'+nomSansListe;
		this.recettesView[nomFonction]();
	}

	rechercherDansListe(){
		const motARechercher = document.querySelector('nav .rechercheBar .aRechercher');
		const liste = document.querySelectorAll('nav ul')[motARechercher.parentNode.classList[1].substr(8)-1];
		this.recettesView.actualiserListe(liste, motARechercher.value);
	}

	async rechercherRecettes(){
		const textARechercher = document.querySelector('.entete .rechercheBar').value;
		const ingrediends = Array.from(document.querySelectorAll('.motsCles .ingredient'), ingredient => ingredient.textContent.trim().toLowerCase());
		const appareils = Array.from(document.querySelectorAll('.motsCles .appareil'), appareil => appareil.textContent.trim().toLowerCase());
		const ustensiles = Array.from(document.querySelectorAll('.motsCles .ustensile'), ustensile => ustensile.textContent.trim().toLowerCase());

		const recettes = await this.model.rechercherRecettes(textARechercher, ingrediends, appareils, ustensiles);
		this.recettesView.afficher(recettes);
	}

	controlerListe(ulListe){
		if(ulListe.classList.contains("reduit")){
			this.developperListe(ulListe);
		}else{
			this.reduireListe(ulListe);
		}
    }

	developperListe(ulListe){
		const indexListeADevelopper = parseInt(ulListe.getAttribute('data-id'));
		
		//fermer les autres listes
		const autresListes = document.querySelectorAll('nav .rechercheList');
		for(let i=0; i<autresListes.length; i++){
			if(indexListeADevelopper !== i){
				this.reduireListe(autresListes[i]);
			}
		}
		//Affecter Position 1 ou 2 ou 3 selon la liste développée afin de déplacer la barre de recherche
		const anciennePosition = document.querySelector('nav .rechercheBar').classList;
		document.querySelector('nav .rechercheBar').classList.replace(anciennePosition[1], `position${indexListeADevelopper+1}`);
		document.querySelector('nav .rechercheBar').classList.replace("cache", "affiche");

		const titre = document.querySelectorAll('nav .titre')[indexListeADevelopper];
		ulListe.classList.replace("reduit", "ouvert");
		titre.classList.add("listeOuverte");
		titre.querySelector('i').classList.replace("fa-chevron-down", "fa-chevron-up");
		document.querySelector('nav .aRechercher').focus();
	}

	reduireListe(ulListe){
		const index = parseInt(ulListe.getAttribute('data-id'));
		document.querySelector('nav .rechercheBar').classList.replace("affiche", "cache");
		ulListe.classList.replace("ouvert", "reduit");
		const titre = document.querySelectorAll('nav .titre')[index];
		titre.classList.remove("listeOuverte");
		titre.querySelector('i').classList.replace("fa-chevron-up", "fa-chevron-down");
	}
}
export default Controller;
