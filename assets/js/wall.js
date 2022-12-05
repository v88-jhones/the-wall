window.addEventListener('load', () => {

    let messages = [];
    
    let selectedMessage = '';
    const messagesContainer = document.querySelector('.messages');
    const modals = document.querySelectorAll('.modal');

    renderMessages();

    //ADD EVENT LISTENER TO EVERY MODAL
    modals.forEach(modal => {
        modal.addEventListener('click', e => {
            closeModal(modal);
        })
        modal.querySelector('.modal_body')
            .addEventListener('click', e => {
                e.stopPropagation();
        });
    
        modal.querySelector('.modal_close')
            .addEventListener('click', e => {
                closeModal(modal)
        });
        modal.querySelector('.modal_cancel')
            .addEventListener('click', e => {
                closeModal(modal)
        });
    })

    //CREATE MODAL
    const btnCreateMessage = document.querySelector('#btn_create_message');
    const createModal = document.querySelector('#create_modal');
    const createMessageForm = document.querySelector('#create_message_form');

    btnCreateMessage.addEventListener('click', () => {
        openModal(createModal);
    })

    // VALIDATION FOR CREATING MESSAGE
    createMessageForm.querySelector('textarea').oninput = (e) => {
        if(e.target.value != ''){
            createMessageForm.querySelector('input[type=submit]').removeAttribute('disabled');
        }
        else{
            createMessageForm.querySelector('input[type=submit]').setAttribute('disabled', true);
        }
    }

    // CREATE MESSAGE FORM SUBMIT
    createMessageForm.addEventListener('submit', e => {
        e.preventDefault();

        const newMessage = createMessageForm.elements['message'].value;
        createMessageForm.elements['message'].value = '';

        addMessage(newMessage);
        renderMessages();
        closeModal(createModal);
        createMessageForm.querySelector('input[type=submit]').setAttribute('disabled', true);
    })

    //DELETE MODAL
    const deleteModal = document.querySelector('#delete_modal');
    const deleteMessageForm = document.querySelector('#delete_message_form');

    deleteMessageForm.addEventListener('submit', e => {
        e.preventDefault();
        deleteMessage(selectedMessage);
        renderMessages();
        closeModal(deleteModal);
    })

    //EVENT BUBBLIGN FROM MESSAGES CONTAINER
    messagesContainer.addEventListener('click', e => {
        
        if(e.target.parentNode.className == 'message_delete'){
            openModal(deleteModal);
            selectedMessage = e.target.parentNode.closest('.message_delete').getAttribute('data-id');
        } 
        else if(e.target.parentNode.className == 'message_edit'){
            let targetElement = e.target.parentNode;
            let targetMessage = targetElement.parentNode.parentNode;
            selectedMessage = targetElement.closest('.message_edit').getAttribute('data-id');
            let clonedMessage = targetMessage.innerHTML;

            targetMessage.innerHTML = `
            <form action="#" class="update_form">
                <textarea 
                    name="content" 
                    id="content" 
                    cols="30" 
                    rows="3"
                    placeholder="Type your comment here"
                >${targetMessage.childNodes[1].textContent}</textarea>
                <div>
                    <a href="#" class="cancel_edit">Cancel</a>
                    <input type="submit" value="Update Message" class="btn btn-primary btn-small">
                </div>
            </form>
            `;

            //ADD EVENT LISTENER TO UPDATE FORM
            targetMessage.childNodes[1].addEventListener('submit', e => {
                e.preventDefault();
                let formData = getFormData(targetMessage.childNodes[1]);
                updateMessage(selectedMessage, formData.content);
                renderMessages();
            });


            let cancelEditBtn = targetMessage.childNodes[1].closest('div').querySelector('.cancel_edit');

            cancelEditBtn.addEventListener('click', e => {
                e.preventDefault();
                targetMessage.innerHTML = clonedMessage;
            })
        }
    })

    //RENDERS
    function renderMessages(){
        document.querySelector('.message_count').innerHTML = messages.length;

        messagesContainer.innerHTML = '';

        if(messages.length < 1){
            messagesContainer.innerHTML = `
            <div class="no_message">
                <img src="../assets/images/no-message.svg" alt="no_message">
                <p>No Posted Message Yet</p>
            </div> 
            `;
        }
        else {
            for(let i = messages.length-1; i >= 0; i--){
                messagesContainer.innerHTML += `
                    <div class="message">
                        <div class="message_content">
                            <p>${messages[i].content}</p>
                            <div class="message_actions">
                                <a href="#" class="message_comment">
                                    <img src="../assets/images/message.svg" alt="message-icon">
                                    <p>
                                        <span>
                                        ${
                                            messages[i].comments
                                                ? messages[i].comments.length
                                                : 0
                                        }
                                        </span>
                                        Comment/s
                                    </p>
                                </a>
                                <a href="#" class="message_edit" data-id="${messages[i].id}">
                                    <img src="../assets/images/pencil-write.svg" alt="edit-icon">
                                    <p>Edit</p>
                                </a>
                                <a href="#" class="message_delete" data-id="${messages[i].id}">
                                    <img src="../assets/images/delete.svg" alt="delete-icon">
                                    <p>Delete</p>
                                </a>
                                <a href="#" class="message_user" data-id="${messages[i].id}">
                                    <img src="../assets/images/user-placeholder.svg" alt="user-icon">
                                    <p><span>You</span> - Few seconds ago</p>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }

    //STATIC ARRAYS OPERATION

    function addMessage(newMessage){
        messages.push({
            id: generateId(),
            content: newMessage,
            comments: [],
        })
    }

    function deleteMessage(id){
        messages = messages.filter(message => message.id != id);
        selectedMessage = '';
    }

    function updateMessage(id, newMessage){
        messages = messages.map(message => {
            if(id == message.id){
                return { ...message, content: newMessage };
            }

            return message;
        })
    }

    function getComments(id){
        let message = messages.find(message => message.id == id);
        return message.comments || null;
    }

    function addComment(id, data){
        let newComment = {
            id: generateId(),
            content: data
        }

        messages = messages.map(message => {
            if(id == message.id){
                return { ...message, comments: [...message.comments, newComment ] }
            }
            return message;
        })
    }

    //HELPER FUNCTIONS

    function openModal(modalElement){
        modalElement.classList.add('show');
    }

    function closeModal(modalElement){
        modalElement.classList.remove('show');
    }

    function generateId(){
        return Date.now().toString(36) + Math.random().toString(36);
    }
});