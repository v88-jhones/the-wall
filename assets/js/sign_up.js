window.addEventListener("load", () => {

    const registerForm = document.querySelector("#register_form"); 

    registerForm.addEventListener("submit", e => {
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
        else if(formData.password.length < 8){
            errors.password = "Password must be atleast 8 characters";
        }

        if(formData.password !== formData.confirm_password){
            errors.confirm_password = "Password must match";
        }

        if(Object.keys(errors).length > 0){
            return errors;
        }

        return false;
    }
});