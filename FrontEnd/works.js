//récupération des travaux
let works = await fetch('http://localhost:5678/api/works');
works = await works.json();
const reponseWorks = JSON.stringify(works);

//génération des travaux sur la gallerie page d'accueil
export function genererWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const sectionWorks = document.querySelector(".gallery");
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const legendeWork = document.createElement("figcaption");
        legendeWork.innerHTML = figure.title;

        sectionWorks.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(legendeWork);
    };
};
genererWorks(works);

//récupération des catégories des travaux
let categories = await fetch('http://localhost:5678/api/categories');
categories = await categories.json();
const reponseCategories = JSON.stringify(categories);

//génération des boutons x filtrer travaux par catégories
function genererFiltres(categories) {
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const barreFiltres = document.getElementById("barre-filtres");
        const boutonFiltre = document.createElement("button");
        boutonFiltre.dataset.id = category.id;
        const filtreTitle = category.name;
        boutonFiltre.innerText = filtreTitle
        boutonFiltre.className = "btn";

        barreFiltres.appendChild(boutonFiltre);

        //e click s bouton filtre
        boutonFiltre.addEventListener("click", function () {
            const objetsFiltre = works.filter(function (works) {

                return works.category.name === filtreTitle;
            });
            document.querySelector(".gallery").innerHTML = "";
            genererWorks(objetsFiltre);
        });
    };
};
genererFiltres(categories);

const boutonTous = document.querySelector("#btn-tous");
boutonTous.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(works);
});




