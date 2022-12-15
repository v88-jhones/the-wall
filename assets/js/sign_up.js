window.addEventListener("load", () => {

    document.querySelector("#register_form").addEventListener("submit", submitRegisterForm);
});

/**
* DOCU: Will redirect if it passed the validation. <br>
* Triggered: When register form is submitted.
* @function
* @param {object} event - To target the register form.
* @author Jhones 
*/
function submitRegisterForm(event){
    event.preventDefault();
    let register_form = event.target;
    let form_data = getFormData(register_form);
    let errors = validateData(form_data);

    if(errors){
        resetErrors(register_form);
        renderErrors(errors, register_form);
    }
    else{
        window.location.href = "/views/wall.html";
    }
}

/**
* DOCU: Will validate the inputs of the register form. <br>
* Triggered: When register form is submitted.
* @function
* @param {object} form_data - The form element that we want to validate.
* @return {object} errors - { email, password, confirm_password } 
* @return {boolean} - false if it has no error 
* @author Jhones 
*/
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