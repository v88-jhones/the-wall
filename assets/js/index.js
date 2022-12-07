window.addEventListener("load", () => {

    const loginForm = document.querySelector("#login_form"); 

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        let formData = getFormData(e.target);
        let errors = validateData(formData);

        if(errors){
            resetErrors(e.target);
            renderErrors(errors, e.target);
        }
        else{
            window.location.href = "/views/wall.html";
        }
    });

    function validateData(formData){
        let errors = {};

        if(formData.email === ""){
            errors.email = "Email cannot be empty";
        }
        else if(formData.email.split("@")[1] == null){
            errors.email = "Email must be valid";
        }
        else if (formData.email.split("@")[1].split(".")[1] == null){
            errors.email = "Email must be valid";
        }

        if(formData.password === ""){
            errors.password = "Password cannot be empty";
        }
 
        if(Object.keys(errors).length > 0){
            return errors;
        }

        return false;
    }
});