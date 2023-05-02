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
const inputTitle = document.getElementById('photoTitle');
const inputCategorie = document.getElementById('photoCategorie');
const input = document.getElementById("uploadImage");
function btnEditClick() {
    btnEdit.click();
}
function inputClick() {
    input.click();
};

//récupération des catégories des travaux
let categories = await fetch('http://localhost:5678/api/categories');
categories = await categories.json();

//création menu déroullant avec liste des catégories
function genererListeCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        const elementListeCategorie = document.createElement('option');
        elementListeCategorie.value = categories[i].name;
        elementListeCategorie.setAttribute('data-value', categories[i].id)
        const listeAllCategories = document.getElementById('listeDeroulanteCategories');
        listeAllCategories.appendChild(elementListeCategorie);

    };
    console.log(categories);
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

//e mouseover sur photo pour montrer maximiseIcon
const photos = document.querySelectorAll(".photoWork");
photos.forEach((photo) => {
    const trash = photo.nextSibling;
    const maximise = trash.nextSibling;
    photo.addEventListener("mouseover", function (event) {
        event.preventDefault();
        maximise.style.display = "block";
    });
    photo.addEventListener("mouseout", function (event) {
        event.preventDefault();
        maximise.style.display = "none";
    });
});

//e click sur icône poubelle x delete photo ds  API + DOM (doit s'enlever sans recharger page)
const trashIcons = document.querySelectorAll(".trashIcon");
trashIcons.forEach((trashIcon) => {
    trashIcon.addEventListener("click", (event) => {
        const figure = trashIcon.parentNode;
        let id = figure.getAttribute("data-id");
        fetch("http://localhost:5678/api/works/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        })

            // .then(function (response) {

            //     console.log(response);
            //     setTimeout(() => console.log(response, 50000));
            //     return response;
            // })
            // .catch(function (error) {
            //     console.log(error)
            //     setTimeout(() => console.log(error, 50000));
            //     return;
            // });
            .then(function (response) {
                if (response.status === 204) {
                    console.log(response);
                    console.log(figure);

                    figure.remove();
                    // modalGallery.innerHTML = "";
                    // sectionWorks.innerHTML = "";
                    // genererModalGallery(works);
                    // genererWorks(works);

                    btnEditClick();

                };
            });
    });
});

//formulaire pour ajouter photo
const formAjoutPhoto = document.createElement("div");
formAjoutPhoto.setAttribute("id", "modalAjoutPhoto");
//générer contenu formulaire pour ajouter photo
function genererModalAjoutPhotoContent() {
    const iconePhoto = document.createElement("img");
    iconePhoto.setAttribute("id", "photoIcon");
    iconePhoto.setAttribute("alt", "logo photo");
    iconePhoto.src = "./assets/icons/photoIcon.png";
    const boutonAjoutPhoto = document.createElement("button");
    boutonAjoutPhoto.type = "button";

    boutonAjoutPhoto.className = ("btn");
    boutonAjoutPhoto.setAttribute("id", "btn-ajoutPhoto");
    boutonAjoutPhoto.innerText = "+ Ajouter photo";
    console.log("ok");


    const typeFile = document.createElement("p");
    typeFile.innerText = "jpg, png : 4mo max";

    modalForm.appendChild(formAjoutPhoto);
    formAjoutPhoto.appendChild(iconePhoto);
    formAjoutPhoto.appendChild(boutonAjoutPhoto);
    formAjoutPhoto.appendChild(typeFile);
    console.log(boutonAjoutPhoto);
    boutonAjoutPhoto.onclick = function () {
        inputClick();
        submitForm();
    };


};
genererModalAjoutPhotoContent();
const modalAjoutPhoto = document.getElementById('modalAjoutPhoto');
const boutonFormAjoutPhoto = document.getElementById("btn-ajoutPhoto");


//ferme la modale et reset les propriétés pour réouverture
const closeModal = function () {
    modal.style.display = "none";
    overlay.style.display = "none";
    modalGallery.style.display = "grid";
    document.getElementById('modalChamps').reset();
    //document.getElementById('modalAjoutPhoto').reset();
    modalAjoutPhoto.innerHTML = "";
    genererModalAjoutPhotoContent();
    modalForm.style.display = "none";
    arrow.style.display = "none";
    deleteGalleryButton.style.display = null;
    btnModal.innerText = "Ajouter une photo";
    btnModal.style.backgroundColor = "#1D6154";

};

//e click sur croix pour fermer modale
const xMarkIcon = document.getElementById("xMarkIcon");
xMarkIcon.addEventListener("click", function (event) {
    event.preventDefault();
    closeModal();
});

//e click en dehors de la modale x fermer modale
overlay.addEventListener("click", closeModal);

function submitForm() {
    //event.preventDefault();
    /* vérifie taille et type de fichier */
    input.addEventListener("change", async function () {
        const image = input.files[0];
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
};


//e click sur bouton modale x changer config 
btnModal.addEventListener("click", function (event) {
    event.preventDefault();
    if (btnModal.innerText === "Ajouter une photo") {
        modalGallery.style.display = "none";
        modalForm.style.display = null;
        arrow.style.display = null;
        document.getElementById("modalTitle").innerText = "Ajout photo";
        deleteGalleryButton.style.display = "none";
        btnModal.innerText = "Valider";
        btnModal.style.backgroundColor = "#A7A7A7";

    } else if (btnModal.innerText === "Valider" && btnModal.style.backgroundColor === "rgb(167, 167, 167)") {
        alert("veuillez remplir tout les champs");

    } else if (btnModal.innerText === "Valider" && btnModal.style.backgroundColor === "rgb(29, 97, 84)") {
        const image = input.files[0];
        const selectedOption = document.querySelector(`#${inputCategorie.list.id} option[value="${inputCategorie.value}"]`);
        const categoryId = selectedOption.getAttribute("data-value");
        const formContent = new FormData();
        formContent.append("title", inputTitle.value);
        formContent.append("category", categoryId);
        formContent.append("image", image);

        //envoi nouveau projet à API
        fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Authorization": "Bearer " + token
            },
            body: formContent
        });
    };

});


//e click sur la flèche x revenir à 1ere config de la modale
arrow.addEventListener("click", function (event) {
    event.preventDefault();
    closeModal();
    btnEditClick();
    // modal.style.display = null;
    // overlay.style.display = null;

    // modalGallery.style.display = "grid";
    // modalForm.style.display = "none";
    // arrow.style.display = "none";
    // document.getElementById("modalTitle").innerText = "Galerie photo";
    // deleteGalleryButton.style.display = null;
    // btnModal.innerText = "Ajouter une photo";
    // btnModal.style.backgroundColor = "#1D6154";


});

    // //rajouter press enter = click sur bouton modale
    // window.addEventListener('keydown', function (event){
    //     if (event.key === "Enter") {

    // };
    // });




