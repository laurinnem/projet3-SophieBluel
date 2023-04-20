import { genererWorks } from './works.js';
const sectionWorks = document.querySelector(".gallery");
const token = window.sessionStorage.getItem("token");
const loginLogout = document.getElementById("btn-loginLogout");
const btnEdit = document.getElementById("btn-edit");
const modal = document.getElementById("modalSection");
const overlay = document.getElementById("overlay");
const modalGallery = document.getElementById("modalGallery");
const arrow = document.getElementById("arrowPrevious");
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
    arrow.style.display = "none";
    deleteGalleryButton.style.display = null;
    btnModal.innerText = "Ajouter une photo";
    btnModal.style.backgroundColor = "#1D6154";
};

//récupération des catégories des travaux
let categories = await fetch('http://localhost:5678/api/categories');
categories = await categories.json();
const reponseCategories = JSON.stringify(categories);

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
        imageElement.className = ("photoWork");
        const maximiseIcon = document.createElement("img");
        maximiseIcon.src = "./assets/icons/maximise.png";
        maximiseIcon.className = ("maximiseIcon");
        const trashIcon = document.createElement("img");
        trashIcon.src = "./assets/icons/trash.png";
        trashIcon.className = ("trashIcon");
        const editWork = document.createElement("a");
        editWork.innerHTML = "éditer";

        modalGallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(trashIcon);
        workElement.appendChild(maximiseIcon);
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

//e mouseover sur photo pour montrer maximiseIcon
const photos = document.querySelectorAll(".photoWork");
photos.forEach((photo) => {
    photo.addEventListener("mouseover", () => {
        photo.nextSibling.style.display = null;
    });
});

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
    console.log(btnModal.innerText === "Valider", btnModal.style.backgroundColor);
    console.log(btnModal.innerText);
    event.preventDefault();
    if (btnModal.innerText === "Ajouter une photo") {
        modalGallery.style.display = "none";
        modalForm.style.display = null;
        arrow.style.display = null;
        document.getElementById("modalTitle").innerText = "Ajout photo";
        deleteGalleryButton.style.display = "none";
        btnModal.innerText = "Valider";
        btnModal.style.backgroundColor = "#A7A7A7";

        //e sur bouton "+ Ajout photo" x charger photo nouveau projet 
        boutonFormAjoutPhoto.addEventListener("click", function (event) {
            event.preventDefault();
            input.click();
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

        console.log(document.getElementById("uploadImage"));
        //si tt les champs remplis: changer btnModal à "#1D6154"
        document.querySelectorAll('.formInput').forEach(input => {
            input.addEventListener('change', event => {
                if (document.getElementById("uploadImage").value.length != 0 && inputTitle.value != "" && inputCategorie.value != "") {
                    btnModal.style.backgroundColor = "#1D6154";
                } else {
                    btnModal.style.backgroundColor = "#A7A7A7";
                }
            });
        });

        console.log(btnModal.innerText);
    } else if (btnModal.innerText === "Valider" && btnModal.style.backgroundColor === "#A7A7A7") {
        console.log("elseif pas ok");
        alert("veuillez remplir tout les champs");

    } else if (btnModal.innerText === "Valider" && btnModal.style.backgroundColor === 'rgb(29, 97, 84)') {
        console.log("elseif tout ok");
        const image = input.files[0];
        const formd = new FormData();
        formd.append("title", inputTitle.value);
        formd.append("category", inputCategorie.value);
        formd.append("image", image.value);
        console.log(formd.get("title"));
        console.log(inputTitle.value);
        //envoi nouveau projet à API
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "multipart/form-data",
                "Authorization": "Bearer " + token
            },
            body: formd
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

//fonction x reset champs ajout photo
function clearInput() {
    inputTitle.value = "";
};

//e click sur la flèche x revenir à 1ere config de la modale
arrow.addEventListener("click", function (event) {
    event.preventDefault();
    modalGallery.style.display = "grid";
    modalForm.style.display = "none";
    arrow.style.display = "none";
    document.getElementById("modalTitle").innerText = "Galerie photo";
    deleteGalleryButton.style.display = null;
    btnModal.innerText = "Ajouter une photo";
    btnModal.style.backgroundColor = "#1D6154";
    clearInput;
    //rajouter fction qui delete les champs du formulaire si ils sont remplis
});

    // //rajouter press enter = click sur bouton modale
    // window.addEventListener('keydown', function (event){
    //     if (event.key === "Enter") {

    // };
    // });




