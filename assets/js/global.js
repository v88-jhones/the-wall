function getFormData(formElement){
    let formData = {};

    Object.keys(formElement.elements).forEach(key => {
        let element = formElement.elements[key];
        if(element.type !== "submit"){
            formData[element.name] = element.value;
        }
    });

    return formData;
}

function renderErrors(errors, formElement){
      
    Object.keys(errors).forEach(key => {
        const paragraph = document.createElement('p');
        const textNode = document.createTextNode(errors[key]);
        paragraph.classList.add('form_error');
        paragraph.appendChild(textNode);

        formElement.elements[key].classList.add('error');
        formElement.elements[key].parentNode.append(paragraph);
    })
}

function resetErrors(formElement){
    formElement.querySelectorAll(".form_error").forEach(e => e.remove());
    formElement.querySelectorAll(".error").forEach(e => e.classList.remove('error'));
}