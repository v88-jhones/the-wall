window.addEventListener('load', () => {

    const loginForm = document.querySelector('#login_form')
    
    loginForm.addEventListener('submit', e => {
        e.preventDefault();

        const formData = getFormData(loginForm);
        const errors = vaildateData(formData);

        if(errors){
            renderErrors(errors, loginForm);
        } 
        else{
            window.location.href = '/views/wall.html';
        }

    });


    function vaildateData(data){
        let errors = {};

        if(data.email == ''){
            errors.email = 'Email cannot be empty';
        }
        else if(data.email.split('@')[1] == null){
            errors.email = 'Email must be valid';
        }
        else if(data.email.split('@')[1].split('.')[1] == null){
            errors.email = 'Email must be valid'
        }

        if(data.password == ''){
            errors.password = 'Password cannot be empty';
        }
        else if(data.password.length < 8){
            errors.password = 'Password must be atleast 8 characters';
        }
        
        if(Object.keys(errors).length > 0){
            return errors;
        }

        return false;

    }



})