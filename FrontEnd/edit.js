import { genererWorks } from './works.js';
const sectionWorks = document.querySelector(".gallery");
const token = window.sessionStorage.getItem("token");
const loginLogout = document.getElementById("btn-loginLogout");
const btnEdit = document.getElementById("btn-edit");
const modal = document.getElementById("modalSection");
const overlay = document.getElementById("overlay");
const modalGallery = document.getElementById("modalGallery");

const modalForm = document.getElementById("modalForm");
const btnModal = document.getElementById("btnModal");
const deleteGalleryButton = document.getElementById("sup");
const boutonFormAjoutPhoto = document.getElementById("btn-ajoutPhoto");
const modalAjoutPhoto = document.getElementById('modalAjoutPhoto');
const inputTitle = document.getElementById('photoTitle');
const inputCategorie = document.getElementById('photoCategorie');
const input = document.getElementById("uploadImage");

//ferme la modale et reset les propriétés pour réouverture
const closeModal = function () {
    modal.style.display = "none";
    overlay.style.display = "none";
    modalGallery.style.display = "grid";
    modalForm.style.display = "none";
    deleteGalleryButton.style.display = null;
    btnModal.innerText = "Ajouter une photo";
    btnModal.style.backgroundColor = "#1D6154";
};

//récupération des catégories des travaux (importer de works.js?)
let categories = await fetch('http://localhost:5678/api/categories');
categories = await categories.json();
const reponseCategories = JSON.stringify(categories);
console.log(categories);

//création menu déroullant avec liste des catégories
function genererListeCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        const elementListeCategorie = document.createElement('option');
        elementListeCategorie.value = categories[i].name;

        const listeAllCategories = document.getElementById('listeDeroulanteCategories');
        listeAllCategories.appendChild(elementListeCategorie);
    };
};
genererListeCategories(categories);

//display editMode (boutton modifier/logout) et cache filtres
if (token) {
    document.getElementById("edit").style.display = null;
    document.getElementById("barre-filtres").style.display = "none";
    loginLogout.setAttribute("href", "index.html");
    loginLogout.innerText = "Logout";

} else {
    document.getElementById("edit").style.display = "none";
    document.getElementById("barre-filtres").style.display = "flex";
    loginLogout.setAttribute("href", "login.html");
    loginLogout.innerText = "Login";

};

//fonction x e click sur "logout" (remove token de sessionStorage)
//et redirection vers index.html
loginLogout.addEventListener("click", function (event) {
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
let works = await fetch('http://localhost:5678/api/works');
works = await works.json();
const reponseWorks = JSON.stringify(works);

function genererModalGallery(works) {
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id;
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const trashIcon = document.createElement("img");
        trashIcon.src = "./assets/icons/trash.png";
        trashIcon.className = ("trashIcon");
        const editWork = document.createElement("a");
        editWork.innerHTML = "éditer";

        modalGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(trashIcon);
        workElement.appendChild(editWork);
    };
};
genererModalGallery(works);

//e click sur modifier x open modale 
btnEdit.addEventListener("click", function (event) {
    event.preventDefault();
    modal.style.display = null;
    overlay.style.display = null;
});

//e click sur croix pour fermer modale
const xMarkIcon = document.getElementById("xMarkIcon");
xMarkIcon.addEventListener("click", function (event) {
    event.preventDefault();
    closeModal();
});

//e click en dehors de la modale x fermer modale
overlay.addEventListener("click", closeModal);

//e click sur icône poubelle x delete photo ds  API + DOM (doit s'enlever sans recharger page)
const trashIcons = document.querySelectorAll(".trashIcon");
trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", () => {
        const figure = trashIcon.parentNode;
        let id = figure.getAttribute("data-id");
        fetch("http://localhost:5678/api/works/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })
            .then(function (response) {
                if (response.status === 204) {
                    figure.remove();
                    modalGallery.innerHTML = "";
                    sectionWorks.innerHTML = "";
                    genererModalGallery(works);
                    genererWorks(works);
                };
            });
    });
});



//e click sur bouton modale x changer config 
btnModal.addEventListener("click", function (event) {
    event.preventDefault();
    if (btnModal.innerText === "Ajouter une photo") {
        console.log(btnModal.innerText);
        modalGallery.style.display = "none";
        modalForm.style.display = null;
        deleteGalleryButton.style.display = "none";
        btnModal.innerText = "Valider";
        btnModal.style.backgroundColor = "#A7A7A7";

        //e sur bouton "+ Ajout photo" x charger photo nouveau projet 
        boutonFormAjoutPhoto.addEventListener("click", function (event) {
            console.log("hello");
            input.click();
            console.log(btnModal.innerText);

            /* vérifie taille et type de fichier */
            input.addEventListener("change", async function () {
                const image = input.files[0];
                console.log(image);
                if (image.type !== "image/jpg" && image.type !== "image/png" && image.type !== "image/jpeg") {
                    alert("jpg ou png obligatoire");
                    return;
                }
                if (image.size > 4 * 1024 * 1024) {
                    alert("La taille maximum du fichier est de 4mo");
                    return;
                }
                /* affichage ds modale de la nouvelle photo, à la place du contenu de div#modalAjoutPhoto */
                modalAjoutPhoto.innerHTML = "";
                const reader = new FileReader();
                reader.readAsDataURL(image);
                reader.onload = function () {
                    image.src = reader.result;
                    const newImage = document.createElement("img");
                    newImage.className = "previewPhoto";
                    newImage.src = image.src;
                    modalAjoutPhoto.appendChild(newImage);

                };
            });
        });

        //si tt les champs remplis: changer btnModal à "#1D6154"
        console.log(document.getElementById("uploadImage"));

        document.querySelectorAll('.formInput').forEach(input => {
            input.addEventListener('change', event => {
                if (document.getElementById("uploadImage").value.length != 0 && inputTitle.value != "" && inputCategorie.value != "") {

                    btnModal.style.backgroundColor = "#1D6154";
                    console.log(btnModal.innerText);
                } else {
                    btnModal.style.backgroundColor = "#A7A7A7";
                }
            });
        });

        console.log(btnModal.innerText);
    } else if (btnModal.innerText === "Valider" && btnModal.style.backgroundColor === "#A7A7A7") {
        console.log("elseif pas ok");
        alert("veuillez remplir tout les champs");

    } else if (btnModal.innerText === "Valider" && btnModal.style.backgroundColor === "#1D6154") {
        console.log("elseif tout ok");
        const image = input.files[0];
        const formData = new formData();
        formData.append("title", title);
        formData.append("category", categorie);
        formData.append("image", image);

        //envoi nouveau projet à API
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + token
            },
            body: formData
        })

            .then(function (response) {
                if (response.status === 201) {
                    return response.json();
                }
            })

            //afficher nouveau projet dans galeries
            .then(function (data) {
                console.log(data);
                modalGallery.innerHTML = "";
                sectionWorks.innerHTML = "";
                genererModalGallery(works);
                genererWorks(works);
                closeModal();
            });
    };

});


    // //rajouter press enter = click sur bouton modale
    // window.addEventListener('keydown', function (event){
    //     if (event.key === "Enter") {

    // };
    // });




