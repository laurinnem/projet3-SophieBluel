let works = window.localStorage.getItem("works");

if (works === null){
    const reponse = await fetch ('http://localhost:5678/api/works');
    works = await reponse.json();
    const reponseWorks = JSON.stringify(works);
    window.localStorage.setItem("works", reponseWorks);
}else{
    works = JSON.parse(works);
    console.log(works);
}

function genererWorks(works){
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
    }
}

genererWorks(works);



