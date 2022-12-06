window.addEventListener("load", () => {

    let selectedElement;
    const messagesContainer = document.querySelector("#messages_container");
    const messageTemplate = document.querySelector("[type='text/html']#message_template");
    const updateFormTemplate = document.querySelector("[type='text/html']#update_form_template");
    const messageCount = document.querySelector("#message_count");
    const noMessage = document.querySelector("#no_message");

    /* Toggling of Modals */

    const modals = document.querySelectorAll(".modal");
    const modalButtons = document.querySelectorAll(".modal_btn");
    const modalBodies = document.querySelectorAll(".modal_body");
    const modalCancels = document.querySelectorAll(".modal_cancel");
    const modalCloses = document.querySelectorAll(".modal_close");
    
    modalButtons.forEach(modalButton => {
        modalButton.addEventListener("click", e => {
            const targetModal = document.querySelector(`#${modalButton.getAttribute("data-target")}`)
            toggleModal(targetModal);
        });
    });
    modals.forEach(modal => {
        modal.addEventListener("click", () => {
            toggleModal(modal);
        });
    });
    modalBodies.forEach(modalBody => {
        modalBody.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });
    modalCancels.forEach(modalCancel => {
        modalCancel.addEventListener("click", () => {
            toggleModal(modalCancel.closest(".modal"));
            selectedElement = null;
        });
    });
    modalCloses.forEach(modalClose => {
        modalClose.addEventListener("click", () => {
            toggleModal(modalClose.closest(".modal"));
            selectedElement = null;
        });
    });
    
    /* Creating Message */

    const createMessageForm = document.querySelector("#create_message_form");
    const btnCreateMessageSubmit = createMessageForm.querySelector("button[type=submit]");

    createMessageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newMessage = e.target.elements.content.value;
        toggleModal(e.target.closest(".modal"));
        addMessage(newMessage);
        e.target.reset();
        btnCreateMessageSubmit.setAttribute("disabled", true);
    })

    /* Validating Textarea */

    createMessageForm.querySelector("textarea").addEventListener("input", (e) => {
        if(e.target.value.length !== 0){
            btnCreateMessageSubmit.removeAttribute("disabled");
        }
        else{
            btnCreateMessageSubmit.setAttribute("disabled", true);
        }
    });

    /* Delete Message */

    const deleteMessageForm = document.querySelector("#delete_message_form");

    deleteMessageForm.addEventListener("submit", e => {
        e.preventDefault();
        toggleModal(e.target.closest(".modal"));
        if(selectedElement.parentNode?.id == "messages_container"){
            removeMessage(selectedElement);
        }
        else{
            removeComment(selectedElement);
        }
        console.log();
        selectedElement = null;
    });

    /* Click Event Bubbling on Message Container */

    messagesContainer.addEventListener("click", (e) => {
        let targetClass = e.target.className.split(" ")[0];
        if(e.target?.closest(".message")?.parentNode?.id == "messages_container"){
            messageControl[targetClass]?.(e.target);
        }
        else if(e.target?.closest(".message")?.parentNode?.className == "comments_container"){
            commentControl[targetClass]?.(e.target);
        }
    })

    /* Object Functions - Called depends on the target class name */

    const messageControl = {
        message_comment: (target) => {
            let targetMessageComment = target.closest(".message").querySelector(".message_comments");
            targetMessageComment.classList.toggle("hide");
            target.classList.toggle("active");
        },
        message_delete: (target) => {
            let targetModal = document.querySelector(`#${target.getAttribute("data-target")}`);
            targetModal.querySelector("h3").textContent = "Confirm Delete Message";
            selectedElement = target.closest(".message");
            toggleModal(targetModal);
        },
        message_edit: (target) => {
            let targetMessage = target.closest(".message");
            let targetMessageContent = targetMessage.querySelector(".message_content");
            targetMessageContent.classList.add("hide");
            addEditForm(targetMessage);
        }
    }

    const commentControl = {

        message_delete: (target) => {
            let targetModal = document.querySelector(`#${target.getAttribute("data-target")}`);
            targetModal.querySelector("h3").textContent = "Confirm Delete Comment";
            selectedElement = target.closest(".message");
            toggleModal(targetModal);
        },
        message_edit: (target) => {
            let targetMessage = target.closest(".message");
            let targetMessageContent = targetMessage.querySelector(".message_content");
            targetMessageContent.classList.add("hide");
            addEditForm(targetMessage, "Comment Update");
        }
    }
    /* Render Functions */

    function addMessage(newMessage){
        let newMessageTemplate = messageTemplate.cloneNode(true).innerHTML;
        messagesContainer.insertAdjacentHTML("afterbegin", newMessageTemplate);

        let newMessageContainer = messagesContainer.querySelector(".message");
        newMessageContainer.querySelector(".message_content>p").textContent = newMessage;
       
        messageCount.textContent = +messageCount.textContent + 1;
        if(+messageCount.textContent >= 1){
            noMessage.classList.add("hide");
        }

        let addCommentForm = newMessageContainer.querySelector(".message form");
        let btnCommentSubmit = addCommentForm.querySelector("button[type=submit]");

        addCommentForm.querySelector("textarea").addEventListener("input", (e) => {
            if(e.target.value.length !== 0){
                btnCommentSubmit.removeAttribute("disabled");
            }
            else{
                btnCommentSubmit.setAttribute("disabled", true);
            }
        });

        addCommentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let newComment = e.target.elements.content.value;
            addComment(newMessageContainer, newComment);
            e.target.reset();
            btnCommentSubmit.setAttribute("disabled", true);
        });
    }

    function addComment(messageContainer, newComment){

        let commentCount = messageContainer.querySelector(".message_actions .message_comment span");
        let newCommentTemplate = messageTemplate.cloneNode(true).innerHTML;
        let newCommentContainer = messageContainer.querySelector(".comments_container");

        newCommentContainer.insertAdjacentHTML("afterbegin", newCommentTemplate);
        newCommentContainer.querySelector(".message_content>p").textContent = newComment;
        newCommentContainer.querySelector(".message_comment").remove();
        newCommentContainer.querySelector(".message_comments").remove();

        console.log(messageContainer);

        commentCount.textContent = +commentCount.textContent + 1;
    }

    function removeMessage(messageElement){
        messageElement.remove();
        messageCount.textContent = +messageCount.textContent - 1;
        if(+messageCount.textContent <= 0){
            noMessage.classList.remove("hide");
        }
    }

    function removeComment(commentElement){
        let commentCount = commentElement.parentNode.closest(".message").querySelector(".message_actions span");
        commentCount.textContent = +commentCount.textContent - 1;
        commentElement.remove();
    }

    function addEditForm(containerElement, submitText = "Message Update"){
        let messageContentElement = containerElement.querySelector(".message_content");
        let formElement = updateFormTemplate.cloneNode(true).innerHTML;

        containerElement.insertAdjacentHTML("afterbegin", formElement);
        containerElement.querySelector("form textarea").value = messageContentElement.querySelector("p").textContent;
        containerElement.querySelector("form button").textContent = submitText;

        let newFormElement = containerElement.querySelector("form");
        let btnFormSubmit = newFormElement.querySelector("button[type=submit]");

        newFormElement.querySelector("textarea").addEventListener("input", (e) => {
            if(e.target.value.length !== 0){
                btnFormSubmit.removeAttribute("disabled");
            }
            else{
                btnFormSubmit.setAttribute("disabled", true);
            }
        })

        newFormElement.querySelector(".cancel_edit").addEventListener("click", () => {
            removeEditForm(containerElement, messageContentElement);
        });

        newFormElement.addEventListener("submit", (e) => {
            e.preventDefault();
            let newContent = e.target.elements.content.value;
            editForm(containerElement, messageContentElement, newContent);
        })
    }

    /* Edit Form Event Listeners */

    function removeEditForm(containerElement, messageContentElement){
        messageContentElement.classList.remove("hide");
        containerElement.querySelector("form").remove();
    }

    function editForm(containerElement, messageContentElement, newContent){
        messageContentElement.querySelector("p").textContent = newContent;
        messageContentElement.classList.remove("hide");
        containerElement.querySelector("form").remove();
    }

    /* Helper Functions */

    function toggleModal(modalElement){
        modalElement.classList.toggle("show");
    }
});