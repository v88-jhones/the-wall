const FORM_VALIDATION = {
    password_length: 8
};

function getFormData(form_element){
    let form_data = {};

    for(let [_, element] of Object.entries(form_element.elements)){
        if(element.type !== "submit"){
            form_data[element.name] = element.value;
        }
    }

    return form_data;
}

function renderErrors(errors, form_element){

    for(let [key, val] of Object.entries(errors)){
        const paragraph = document.createElement('p');
        const textNode = document.createTextNode(val);
        paragraph.classList.add('form_error');
        paragraph.appendChild(textNode);

        form_element.elements[key].classList.add('error');
        form_element.elements[key].parentNode.append(paragraph);
    }
}

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