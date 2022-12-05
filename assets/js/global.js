function getFormData(formElement) {
    let FormData = {};

    Object.keys(formElement.elements).forEach(key => {
        let element = formElement.elements[key];
        if(element.type != 'submit'){
            FormData[element.name] = element.value;
        }
    })

    return FormData;
}

function renderErrors(errors, formElement){
    resetErrors();
    
    Object.keys(errors).forEach(val => {
        console.log(val)
        const para = document.createElement('p');
        const node = document.createTextNode(errors[val]);
        para.classList.add('error');
        para.appendChild(node);
        formElement.elements[val].classList.add('error');
        formElement.elements[val].parentNode.append(para);
    })
}

function resetErrors(){
    document.querySelectorAll('p.error').forEach(e => e.remove());
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
}
