document.addEventListener('DOMContentLoaded', function (event) {
    const seConnecter = document.querySelector("#btn-seConnecter");

    seConnecter.addEventListener("click", function (event) {
        event.preventDefault();
        const email = document.querySelector("[name=email]").value;
        const password = document.querySelector("[name=password]").value;

        const regExEmail = (value) => {
            return /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(value);
        };

        const regExPassword = (value) => {
            return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/.test(value);
        };

        function emailControle() {
            if (regExEmail(email)) {
                return true;
            } else {
                alert("l'email n'est pas valide");
                return false;
            }
        };

        function passwordControle() {
            if (regExPassword(password)) {
                return true;
            } else {
                alert("le mot de passe n'est pas valide");
                return false;
            }
        };

        if (emailControle() && passwordControle()) {

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

                .then(function (response) {
                    if (response.status === 200) {
                        return response.json();
                    } else {
                        alert("Erreur dans l'identifiant ou le mot de passe");
                    }
                })

                .then(function (userInfo) {
                    if (userInfo) {
                        window.sessionStorage.setItem("token", JSON.stringify(userInfo));
                        window.sessionStorage.setItem("token", userInfo.token);
                        window.location.replace("index.html");
                    }
                });
        };
    });
});



