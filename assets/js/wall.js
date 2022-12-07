window.addEventListener("load", () => {

    let selectedElement;
    const messagesContainer = document.querySelector("#messages_container");
    const messageTemplate = document.querySelector("[type='text/html']#message_template");
    const updateFormTemplate = document.querySelector("[type='text/html']#update_form_template");
    const messageCount = document.querySelector("#message_count");
    const noMessage = document.querySelector(".no_message");

    /* Toggling of Modals */

    const modals = document.querySelectorAll(".modal");
    const modalButtons = document.querySelectorAll(".modal_btn");
    const modalBodies = document.querySelectorAll(".modal_body");
    const modalCancels = document.querySelectorAll(".modal_cancel");
    const modalCloses = document.querySelectorAll(".modal_close");

    modalButtons.forEach(modalButton => {
        modalButton.addEventListener("click", (e) => {
            const targetId = modalButton.getAttribute("data-target");
            const targetModal = document.querySelector(`#${targetId}`);
            toggleModal(targetModal);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener("click", (e) => {
            toggleModal(e.target);
        });
    });

    modalCancels.forEach(modalCancel => {
        modalCancel.addEventListener("click", (e) => {
            toggleModal(e.target.closest('.modal'));
        });
    });

    modalCloses.forEach(modalClose => {
        modalClose.addEventListener("click", (e) => {
            toggleModal(e.target.closest(".modal"));
        });
    });

    modalBodies.forEach(modalBody => {
        modalBody.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });

    /*  End of Toggling of Modals */

    /* Creating Message */

    const createMessageForm = document.querySelector("#create_message_form");
    const btnCreateMessageSubmit = createMessageForm.querySelector("button[type=submit]");

    /* Create Message Submit Event */

    createMessageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newMessage = e.target.elements.content.value;
        toggleModal(e.target.closest(".modal"));
        addMessage(newMessage);
        e.target.reset();
        btnCreateMessageSubmit.setAttribute("disabled", true);
    });

    validateForm(createMessageForm);

    /* End of Creating Message */

    /* Deleting Message */

    const deleteMessageForm = document.querySelector("#delete_form");

    deleteMessageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        toggleModal(e.target.closest(".modal"));

        if(selectedElement?.parentNode?.id =="messages_container"){
            removeMessage(selectedElement);
        }
        else if(selectedElement?.parentNode?.className =="comments_container"){
            removeComment(selectedElement);
        }

        selectedElement = null;
    });

    /* End of Deleting Message */

    /* Click Event Bubbling for Message Container */

    messagesContainer.addEventListener("click", (e) => {
        let targetClass = e.target.className.split(" ")[0];
        if(e.target?.closest(".message")?.parentNode?.id === "messages_container"){
            messageControl[targetClass]?.(e.target);
        }
        else if(e.target?.closest(".message")?.parentNode?.className  === "comments_container"){
            commentControl[targetClass]?.(e.target);
        }
    });

    /* End of Click Event Bubbling for Message Container */

    /* Condition Functions For Messages */

    const messageControl = {
        message_comment: (target) => {
            let targetMessageComment = target.closest(".message").querySelector(".message_comments");
            targetMessageComment.classList.toggle("hide");
            target.classList.toggle("active");
        },
        message_delete: (target) => {
            let targetModal = document.querySelector(`#${target.getAttribute("data-target")}`);
            targetModal.querySelector(".modal_title").textContent = "Confirm Delete Message";
            targetModal.querySelector(".modal_desc").textContent = "Are you sure you want to remove this message?";
            selectedElement = target.closest(".message");
            toggleModal(targetModal);
        },
        message_edit: (target) => {
            let targetMessage = target.closest(".message");
            let targetMessageContent = targetMessage.querySelector(".message_content");
            targetMessageContent.classList.add("hide");
            addEditForm(targetMessage);
        }
    };

    /* End of Condition Functions For Messages */

    /* Condition Functions For Comments */

    const commentControl = {
        message_delete: (target) => {
            let targetModal = document.querySelector(`#${target.getAttribute("data-target")}`);
            targetModal.querySelector(".modal_title").textContent = "Confirm Delete Comment";
            targetModal.querySelector(".modal_desc").textContent = "Are you sure you want to remove this comment?";
            selectedElement = target.closest(".message");
            toggleModal(targetModal);
        },
        message_edit: (target) => {
            let targetMessage = target.closest(".message");
            let targetMessageContent = targetMessage.querySelector(".message_content");
            targetMessageContent.classList.add("hide");
            addEditForm(targetMessage, "Comment Update");
        }
    };

    /* End of Condition Functions For Messages */

    /* Render Functions */

    function addMessage(newMessage){
        let newMessageTemplate = messageTemplate.cloneNode(true).innerHTML;
        messagesContainer.insertAdjacentHTML("afterbegin", newMessageTemplate);
        
        let newMessageContainer = messagesContainer.querySelector(".message");
        newMessageContainer.querySelector(".message_content>p").textContent = newMessage;

        incrementMessageCount(1);

        /* Add Event Listener to it's form */
        let addCommentForm = newMessageContainer.querySelector(".message_form");
        validateForm(addCommentForm);

        addCommentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let newComment = e.target.elements.content.value;
            addComment(newMessageContainer, newComment);
            e.target.reset();
            addCommentForm.querySelector("button[type='submit']").setAttribute("disabled", true);
        });

    }

    function removeMessage(messageElement){
        messageElement.remove();
        incrementMessageCount(-1);
    }

    function removeComment(commentElement){
        let commentCount = commentElement.parentNode.closest(".message").querySelector(".message_actions .message_comment span");
        commentCount.textContent = +commentCount.textContent - 1;
        commentElement.remove();
    }

    function addEditForm(containerElement, btnText = "Message Update"){
        let messageContentElement = containerElement.querySelector(".message_content");
        let formElement = updateFormTemplate.cloneNode(true).innerHTML;

        containerElement.insertAdjacentHTML("afterbegin", formElement);

        let contentCopy = messageContentElement.querySelector("p").textContent;
        containerElement.querySelector("form textarea").value = contentCopy;
        containerElement.querySelector("form button").textContent = btnText;

        let newFormElement = containerElement.querySelector("form");

        validateForm(newFormElement);
        newFormElement.querySelector(".cancel_edit").addEventListener("click", () => {
            removeEditForm(containerElement, messageContentElement);
        });

        newFormElement.addEventListener("submit", (e) => {
            e.preventDefault();
            let newContent = e.target.elements.content.value;
            editMessage(containerElement, messageContentElement, newContent);
        });

    }

    function removeEditForm(containerElement, messageContentElement){
        messageContentElement.classList.remove("hide");
        containerElement.querySelector("form").remove();
    }

    function editMessage(containerElement, messageContentElement, newContent){
        messageContentElement.querySelector("p").textContent = newContent;
        messageContentElement.classList.remove("hide");
        containerElement.querySelector("form").remove();
    }

    function addComment(messageContainer, newComment){
        let commentCount = messageContainer.querySelector(".message_actions .message_comment span");
        let newCommentTemplate = messageTemplate.cloneNode(true).innerHTML;
        let commentContainer = messageContainer.querySelector(".comments_container");

        commentContainer.insertAdjacentHTML("afterbegin", newCommentTemplate);
        commentContainer.querySelector(".message_content>p").textContent = newComment;
        commentContainer.querySelector(".message_comment").remove();
        commentContainer.querySelector(".message_comments").remove();
        commentCount.textContent = +commentCount.textContent + 1;
    }

    /* End of Render Functions */

    /* Helper Functions */

    function toggleModal(modalElement){
        modalElement.classList.toggle("show");
    }

    function incrementMessageCount(value){
        messageCount.textContent = +messageCount.textContent + value;
        if(+messageCount.textContent <= 0){
            noMessage.classList.remove("hide");
        } 
        else {
            noMessage.classList.add("hide");
        }
    }

    function validateForm(formElement){
        let btnSubmit = formElement.querySelector("button[type='submit']");

        formElement.querySelector("textarea").addEventListener("input", (e) => {
            if(e.target.value.length !== 0){
                btnSubmit.removeAttribute("disabled");
            }
            else {
                btnSubmit.setAttribute("disabled", true);
            }
        })
    }
});