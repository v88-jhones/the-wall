window.addEventListener("load", () => {

    const login_form = document.querySelector("#login_form"); 

    login_form.addEventListener("submit", e => {
        e.preventDefault();

        let form_data = getFormData(e.target);
        let errors = validateData(form_data);

        if(errors){
            resetErrors(e.target);
            renderErrors(errors, e.target);
        }
        else{
            window.location.href = "/views/wall.html";
        }
    });

    function validateData(form_data){
        let errors = {};

        if(form_data.email === ""){
            errors.email = "Email cannot be empty";
        }
        else if(form_data.email.split("@")[1] == null){
            errors.email = "Email must be valid";
        }
        else if (form_data.email.split("@")[1].split(".")[1] == null){
            errors.email = "Email must be valid";
        }

        if(form_data.password === ""){
            errors.password = "Password cannot be empty";
        }
 
        if(Object.keys(errors).length > 0){
            return errors;
        }

        return false;
    }
});