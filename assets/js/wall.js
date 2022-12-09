window.addEventListener("load", () => {

    let selectedElement;
    const messagesContainer = document.querySelector("#messages_container");
    const messageTemplate = document.querySelector("#message_template");
    const messageCount = document.querySelector("#message_count");
    const noMessage = document.querySelector(".no_message");

    /* Toggling of Modals */

    const modalButtons = document.querySelectorAll(".modal_btn");

    modalButtons.forEach(modalButton => {
        modalButton.addEventListener("click", (e) => {
            const targetId = modalButton.getAttribute("data-target");
            const targetModal = document.querySelector(`#${targetId}`);
            toggleModal(targetModal);
        });
    });

    document.addEventListener("click", (e) => {
        if(
            e.target.matches(".modal") ||
            e.target.matches(".modal_close") || 
            e.target.matches(".modal_cancel")
        ){
            let targetModal = e.target.closest(".modal");
            toggleModal(targetModal);
        }
    });

    /*  End of Toggling of Modals */

    /* Event Delegation For Form Submit */

    messagesContainer.addEventListener("submit", (e) => {
        e.preventDefault();
        let targetClass = e.target.className.split(" ")[0];
        formSubmit?.[targetClass]?.(e.target);
    })

    const formSubmit = {
        update_form: (target) => {
            let targetMessageContent = target.closest('.message').querySelector('.message_content');
            let newMessage = target.elements.content.value;
            targetMessageContent.querySelector("p").textContent = newMessage;
            target.classList.add("hide");
            targetMessageContent.classList.remove("hide");
        },
        message_form: (target) => {
            let targetCommentsContainer = target.closest('.message').querySelector('.comments_container');
            addComment(targetCommentsContainer, target);
        }
    }

    /* End Event Delegation For Form Submit */

    /* Creating Message */

    const createMessageForm = document.querySelector("#create_message_form");
    createMessageForm.addEventListener("submit", addMessage);
    validateForm(createMessageForm);

    /* End of Creating Message */

    /* Deleting Message / Comment */

    const deleteForm = document.querySelector("#delete_form");

    deleteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        toggleModal(e.target.closest(".modal"));

        if(selectedElement?.parentNode?.id =="messages_container"){
            removeMessage(selectedElement);
            selectedElement.remove();
        }
        else if(selectedElement?.parentNode?.className =="comments_container"){
            removeComment(selectedElement);
        }

        selectedElement = null;
    });

    /* End of Deleting Message / Comment */

    /* Click Event Delegation for Message Container */

    messagesContainer.addEventListener("click", (e) => {
        let targetClass = e.target.className.split(" ")[0];
        if(e.target?.closest(".message")?.parentNode?.id === "messages_container"){
            messageControl[targetClass]?.(e.target);
        }
        else if(e.target?.closest(".message")?.parentNode?.className  === "comments_container"){
            commentControl[targetClass]?.(e.target);
        }
    });

    /* End of Click Delegation Bubbling for Message Container */

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
            let targetMessageContent = target.closest(".message_content");
            let targetMessage = target.closest(".message");
            let targetUpdateForm = targetMessage.querySelector(".update_form");

            targetMessageContent.classList.add("hide");
            targetUpdateForm.classList.remove("hide");
        },
        cancel_edit: (target) => {
            target.closest(".update_form").classList.add("hide");
            target.closest(".message").querySelector('.message_content').classList.remove("hide");
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
            let targetMessageContent = target.closest(".message_content");
            let targetMessage = target.closest(".message");
            let targetUpdateForm = targetMessage.querySelector(".update_form");

            targetMessageContent.classList.add("hide");
            targetUpdateForm.classList.remove("hide");
        },
        cancel_edit: (target) => {
            target.closest(".update_form").classList.add("hide");
            target.closest(".message").querySelector('.message_content').classList.remove("hide");
        }
    };

    /* End of Condition Functions For Messages */

    /* Render Functions */

    function addMessage(e){
        e.preventDefault();
        let newMessageElement = messageTemplate.cloneNode(true);
        let newMessage = e.target.elements.content.value;
        let submitBtn = e.target.querySelector("button[type='submit']");

        newMessageElement.querySelector(".message_content>p").textContent = newMessage;
        newMessageElement.classList.remove("hide");
        newMessageElement.removeAttribute("id");
        newMessageElement.querySelector(".update_form textarea").value = newMessage;
        messagesContainer.prepend(newMessageElement);
        updateCount(messagesContainer, messageCount);
        submitBtn.setAttribute("disabled", true);
        e.target.reset();
        toggleModal(e.target.closest(".modal"));

        /* Add Event Listener to it's form */
        let addCommentForm = newMessageElement.querySelector(".message_form");
        let updateForm = newMessageElement.querySelector(".update_form");

        validateForm(addCommentForm);
        validateForm(updateForm);
    }

    function addComment(containerElement, formElement){
        let newCommentElement = messageTemplate.cloneNode(true);
        let newMessage = formElement.elements.content.value;
        let submitBtn = formElement.querySelector("button[type='submit']");
        let commentCount = formElement.closest(".message").querySelector(".message_comment span");

        newCommentElement.querySelector(".message_content>p").textContent = newMessage;
        newCommentElement.classList.remove("hide");
        newCommentElement.querySelector(".update_form textarea").value = newMessage;
        newCommentElement.querySelector(".message_comment").remove();
        newCommentElement.querySelector(".message_comments").remove();
        containerElement.prepend(newCommentElement);

        updateCount(containerElement, commentCount);
        submitBtn.setAttribute("disabled", true);
        formElement.reset();

        /* Add Event Listener to it's form */
        let updateForm = newCommentElement.querySelector(".update_form");
        validateForm(updateForm);
    }

    function removeMessage(messageElement){
        messageElement.remove();
        updateCount(messagesContainer, messageCount);
    }

    function removeComment(commentElement){
        let commentCount = commentElement.parentNode.closest(".message").querySelector(".message_actions .message_comment span");
        let commentContainer = commentElement.closest(".comments_container");
        commentElement.remove();
        updateCount(commentContainer ,commentCount);
    }

    /* End of Render Functions */

    /* Helper Functions */

    function toggleModal(modalElement){
        modalElement.classList.toggle("show");
    }

    function updateCount(containerElement, countElement){
        let newCount = containerElement.children.length;
        countElement.textContent = newCount; 
        if(newCount >= 0){
            noMessage.classList.add("hide");
        }
        else {
            noMessage.classList.remove("hide");
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