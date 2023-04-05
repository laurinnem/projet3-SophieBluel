
const token = window.sessionStorage.getItem("token");
const loginLogout = document.getElementById("btn-loginLogout");
const btnEdit = document.getElementById("btn-edit");
const modal = document.getElementById("modalSection");
const overlay = document.getElementById("overlay");
const modalGallery = document.getElementById("modalGallery");
const modalForm = document.getElementById("modalForm");
const btnModal = document.getElementById("btnModal");
const closeModal = modal.style.display = "none";
const deleteGalleryButton = document.getElementById("sup");


//display editMode (boutton modifier/logout) et cache filtres
if (token) {
    document.getElementById("edit").style.display = null;
    document.getElementById("barre-filtres").style.display = "none";
    loginLogout.setAttribute("href", "index.html");
    loginLogout.innerText = "Logout";

}else{
    document.getElementById("edit").style.display = "none";
    document.getElementById("barre-filtres").style.display = null;
    loginLogout.setAttribute("href", "login.html");
    loginLogout.innerText = "Login";
    
};

//fonction x e click sur "logout" (remove token de sessionStorage)
//et redirection vers index.html
loginLogout.addEventListener("click", function(event) {
    event.preventDefault();
    if (loginLogout.innerText === "Logout") {
        sessionStorage.removeItem("token");
        return location.reload();
    }
    //e click sur "login"
    else if (loginLogout.innerText === "Login") {
        location.replace("login.html");
    }
 });


//création éléments de la gallerie en récupérant images de l'API
let works = await fetch ('http://localhost:5678/api/works');
    works = await works.json();
    const reponseWorks = JSON.stringify(works);
    //window.localStorage.setItem("works", reponseWorks);
        
function genererModalGallery(works) {
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const editWork = document.createElement("a");
        editWork.innerHTML = "éditer";
        
        modalGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(editWork);
    };
};
genererModalGallery(works);
    
//e click sur modifier x open modale (changer display)
btnEdit.addEventListener("click", function(event) {
    event.preventDefault();
    modal.style.display = null;
    overlay.style.display = null;
});


//e click sur croix pour fermer modale
//e click en dehors de la modale x fermer modale


//e click sur icône poubelle x delete photo ds  API + DOM (doit s'enlever sans recharger page)

//e click sur "supprimer la gallerie" x supprimer tout ds API => doit ê fonctionnel??)

//e click sur bouton "ajouter une photo" x changer config modale2 (mm id x éléments modal2-querySelectorAll)/ 
//+ créer éléments non présents ds html si besoin
btnModal.addEventListener("click", function(event) {
    event.preventDefault();
    if (btnModal.innerText === "Ajouter une photo") {
        modalGallery.style.display = "none";
        modalForm.style.display = null;
        deleteGalleryButton.style.display = "none";
        btnModal.innerText = "Valider";
        btnModal.style.backgroundColor = "#A7A7A7";
        //récup liste catégories (fetch) x champs categories + possibilité ajout nouvelle categorie?
            //e click sur ajouter photo x charger new photo + afficher new photo ds modale

            //si tt les champs remplis: changer btnModal à "#1D6154"

    }else if (btnModal.innerText === "valider" && btnModal.style.backgroundColor === "#A7A7A7") {
        //message erreur "veuillez remplir tout les champs"
        

    }else if (btnModal.innerText === "valider" && btnModal.style.backgroundColor === "#1D6154") {
        //envoi nouveau projet à API

        closeModal;
        //nouveau projet doit s'afficher sans recharger la page (où et comment actualiser DOM?)
    }
});



