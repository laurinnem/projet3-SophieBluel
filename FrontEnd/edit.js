
const token = window.sessionStorage.getItem("token");
const loginLogout = document.getElementById("btn-loginLogout");
const btnEdit = document.getElementById("btn-edit");
const modal = document.getElementById("modalSection");
const overlay = document.getElementById("overlay");
const modalFirst = document.querySelectorAll(".modalFirst");
const modalSecond = document.querySelectorAll(".modalSecond");
const editModal = document.getElementById("btnModal");


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
    let modalWorks = fetch('http://localhost:5678/api/works')
    .then (function (response) {
        modalWorks = response.json();
        //modalWorks = JSON.stringify(modalWorks);
        
        console.log(modalWorks);
    })
    .then (function modalGallery(modalWorks) {
        for (let i = 0; i < modalWorks.length; i++) {
            const figure = modalWorks[i];
            const sectionWorks = document.querySelector("#modalGallery");
            const workElement = document.createElement("figure");
            workElement.dataset.id = works[i].id;
            const imageElement = document.createElement("img");
            imageElement.src = figure.imageUrl;
            const editWork = document.createElement("a");
            editWork.innerHTML = "éditer";
    
            sectionWorks.appendChild(workElement);
            workElement.appendChild(imageElement);
            workElement.appendChild(editWork);
        }
        modalGallery(modalWorks);
     });
    
//e click sur modifier x open modale (changer display)
    btnEdit.addEventListener("click", function(event) {
        event.preventDefault();
        modal.style.display = null;
        overlay.style.display = null;
    };
    
    

);

//e click sur croix pour fermer modale
//e click en dehors de la modale x fermer modale


//e click sur icône poubelle x delete photo (ds local storage? + API)

//e click sur "supprimer la gallerie" x supprimer tout (localStorage + API => doit ê fonctionnel??)

//e click sur bouton "ajouter une photo" x changer config modale2 (mm id x éléments modal2-querySelectorAll)/ 
//+ créer éléments non présents ds html si besoin
editModal.addEventListener("click", function(event) {
    event.preventDefault();
    //modalFirst.style.visibility = "hidden";
    modalSecond.style.display = null;
    editModal.innerText = "Valider";
})

//e click sur "+ ajouter photo" x choisir photo + afficher photo ds modale 
//e click sur "valider" x ajouter photo + titre + catégorie à localStorage + API
//...et retour à page d'acceuil- fermeture modale et ajout nouveau projet sur la page, ac bouton "modifier" 

//puis clicks qui changent contenu de la modale (créer tt les elements ac id "modal1/2/3" 
//x les faire apparaitres tous en mm tps ac querySelectorAll)

