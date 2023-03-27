//charge DOM content avant d'éxécuter la fonction (script ds head)
document.addEventListener('DOMContentLoaded', function (event) {
    const seConnecter = document.querySelector("#btn-seConnecter");

    seConnecter.addEventListener("click", function (event) {
        event.preventDefault();
        const email = document.querySelector("[name=email]").value;
        const password = document.querySelector("[name=password]").value;
        
        let response = fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        .then (function (response){
            console.log(response);
            if (response.status === 200) {
                return response.json();
            }else{
                alert("Erreur dans l'identifiant ou le mot de passe");
                return Promise.reject();
            }
        })

        .then (function (userInfo) {
            console.log(userInfo);
            if (userInfo) {
                window.sessionStorage.setItem("token", JSON.stringify(userInfo));
                window.sessionStorage.setItem("token", userInfo.token);
                window.location.replace("index.html");
            }
            });
    });
    });


