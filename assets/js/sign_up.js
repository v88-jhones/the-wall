window.addEventListener("load", () => {

    document.querySelector("#register_form").addEventListener("submit", submitRegisterForm);
});

function submitRegisterForm(event){
    event.preventDefault();

    let form_data = getFormData(event.target);
    let errors = validateData(form_data);

    if(errors){
        resetErrors(event.target);
        renderErrors(errors, event.target);
    }
    else{
        window.location.href = "/views/wall.html";
    }
}

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
    else if(form_data.password.length < FORM_VALIDATION.password_length){
        errors.password = `Password must be atleast ${FORM_VALIDATION.password_length} characters`;
    }

    if(form_data.password !== form_data.confirm_password){
        errors.confirm_password = "Password must match";
    }

    if(Object.keys(errors).length > 0){
        return errors;
    }

    return false;
}