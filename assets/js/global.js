const FORM_VALIDATION = {
    password_length: 8
};

function get_form_data(form_element){
    let form_data = {};

    Object.keys(form_element.elements).forEach(key => {
        let element = form_element.elements[key];
        if(element.type !== "submit"){
            form_data[element.name] = element.value;
        }
    });

    return form_data;
}

function render_errors(errors, form_element){
      
    Object.keys(errors).forEach(key => {
        const paragraph = document.createElement('p');
        const textNode = document.createTextNode(errors[key]);
        paragraph.classList.add('form_error');
        paragraph.appendChild(textNode);

        form_element.elements[key].classList.add('error');
        form_element.elements[key].parentNode.append(paragraph);
    })
}

function reset_errors(form_element){
    form_element.querySelectorAll(".form_error").forEach(e => e.remove());
    form_element.querySelectorAll(".error").forEach(e => e.classList.remove('error'));
}