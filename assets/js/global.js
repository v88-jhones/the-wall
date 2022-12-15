/* Contants for validating the forms */
const FORM_VALIDATION = {
    password_length: 8
};

/**
* DOCU: Will get all the values from the form. <br>
* Triggered: When login/register form is submitted.
* @function
* @param {object} form_element - The form element that we want to get the data.
* @author Jhones 
*/
function getFormData(form_element){
    let form_data = {};

    for(let [_, element] of Object.entries(form_element.elements)){
        if(element.type !== "submit"){
            form_data[element.name] = element.value;
        }
    }

    return form_data;
}

/**
* DOCU: Will render the errors in the form. <br>
* Triggered: When there is an error in the form.
* @function
* @param {object} errors - Key value pairs of errors.
* @param {object} form_element - The form element that we want to render the errors.
* @author Jhones 
*/
function renderErrors(errors, form_element){

    /* Loop through errors and append a paragraph element to it's matching keys in form element */
    for(let [key, val] of Object.entries(errors)){
        const paragraph = document.createElement('p');
        const textNode = document.createTextNode(val);
        paragraph.classList.add('form_error');
        paragraph.appendChild(textNode);

        form_element.elements[key].classList.add('error');
        form_element.elements[key].parentNode.append(paragraph);
    }
}

/**
* DOCU: Will reset and clear all the errors in the form. <br>
* Triggered: When login/register form is submitted.
* @function
* @param {object} form_element - The form element that we want to reset the errors.
* @author Jhones 
*/
function resetErrors(form_element){
    let error_texts = form_element.querySelectorAll(".form_error");
    let error_inputs = form_element.querySelectorAll(".error");

    for(let error_text of error_texts){
        error_text.remove();
    }

    for(let errors_input of error_inputs){
        errors_input.classList.remove('error');
    }
}