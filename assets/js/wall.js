window.addEventListener("load", () => {

    let selected_element;
    const messages_container = document.querySelector("#messages_container");
    const create_message_form = document.querySelector("#create_message_form");

    /* Toggling of Modals */
    document.addEventListener("click", closeModalClick);

    /* Creating Message */
    document.querySelector("#btn_create").addEventListener("click", createMessageClick);
    create_message_form.addEventListener("submit", addMessageSubmit);
    create_message_form.querySelector("textarea").addEventListener("input", validateInput);

    /* Deleting */
    document.querySelector("#delete_message_form").addEventListener("submit", deleteMessageFormSubmit);
    document.querySelector("#delete_comment_form").addEventListener("submit", deleteCommentFormSubmit);

    messages_container.addEventListener("submit", messageContainerSubmit);
    messages_container.addEventListener("click", messageContainerClick);
    messages_container.addEventListener("click", commentContainerClick);
    messages_container.addEventListener("input", validateInput);

    function closeModalClick(event){
        const target = event.target;
        if(
            target.matches(".modal") ||
            target.matches(".modal_close") || 
            target.matches(".modal_cancel")
        ){
            let target_modal = target.closest(".modal");
            toggleModal(target_modal);

            if(target_modal.id === "create_modal"){
                target_modal.querySelector("textarea").value = "";
                target_modal.querySelector("button[type='submit']").setAttribute("disabled", true);
            }
        }
    }

    function createMessageClick(){
        toggleModal(document.querySelector(`#create_modal`));
        create_message_form.querySelector("textarea").focus();
    }

    function addMessageSubmit(event){
        event.preventDefault();
        let create_message_form = event.target; 
        let new_message_element = document.querySelector("#message_template").cloneNode(true);
        let new_message = create_message_form.elements.content.value;
        let submit_btn = create_message_form.querySelector("button[type='submit']");

        new_message_element.classList.remove("hide");
        new_message_element.removeAttribute("id");
        new_message_element.querySelector(".message_content>p").textContent = new_message;
        messages_container.prepend(new_message_element);

        updateMessagesCount();
        submit_btn.setAttribute("disabled", true);
        create_message_form.reset();
        toggleModal(create_message_form.closest(".modal"));
    }
    
    function messageContainerClick(event){
        let target_parent = event.target.parentNode.parentNode.className;
        if(target_parent === "message_content" || target_parent === "message" ){
            let target_class = event.target.className.split(" ")[0];
            message_control?.[target_class]?.(event.target);
        }
    }

    const message_control = {
        message_comment: toggleComment,
        message_delete: deleteMessage,
        message_edit: editMessage,
        cancel_edit: cancelEditMessage
    };

    function toggleComment(target){
        let comment_container = target.closest(".message").querySelector(".message_comments");
        comment_container.classList.toggle("hide");
        comment_container.querySelector("form textarea").focus();
        target.classList.toggle("active");
    }

    function deleteMessage(target){
        let target_modal = document.getElementById(`delete_message_modal`);
        selected_element = target.closest(".message");
        toggleModal(target_modal);
    }

    function editMessage(target){
        let message_content = target.closest(".message_content");
        let update_form = target.closest(".message").querySelector(".update_message_form");
        let textarea = update_form.querySelector("textarea");

        textarea.value = message_content.querySelector("p").textContent;
        message_content.classList.add("hide");
        update_form.classList.remove("hide");
        textarea.focus();
    }

    function cancelEditMessage(target){
        target.closest(".update_message_form").classList.add("hide");
        target.closest(".message").querySelector(".message_content").classList.remove("hide");
    }

    function commentContainerClick(event){
        let target_parent = event.target.parentNode.parentNode.className;
        if(target_parent === "comment_content" || target_parent === "comment"){
            let target_class = event.target.className.split(" ")[0];
            comment_control?.[target_class]?.(event.target);
        }
    }

    const comment_control = {
        comment_delete: deleteComment,
        comment_edit: editComment,
        cancel_edit: cancelEditComment,
    };

    function deleteComment(target){
        let target_modal = document.querySelector(`#delete_comment_modal`);
        selected_element = target.closest(".comment");
        toggleModal(target_modal);
    }
        
    function editComment(target){
        let target_message_content = target.closest(".comment_content");
        let target_update_form = target.closest(".comment").querySelector(".update_comment_form");
        let target_textarea = target_update_form.querySelector("textarea");

        target_textarea.value = target_message_content.querySelector("p").textContent;

        target_message_content.classList.add("hide");
        target_update_form.classList.remove("hide");
        target_textarea.focus();
    }

    function cancelEditComment(target){
        target.closest(".update_comment_form").classList.add("hide");
        target.closest(".comment").querySelector(".comment_content").classList.remove("hide");
    }

    function deleteMessageFormSubmit(event){
        event.preventDefault();
        toggleModal(event.target.closest(".modal"));
        selected_element.remove();
        selected_element = null;
        updateMessagesCount();
    }

    function deleteCommentFormSubmit(event){
        event.preventDefault();
        let message_container = selected_element.parentNode.closest(".message");
        selected_element.remove();
        selected_element = null;
        updateCommentsCount(message_container);
        toggleModal(event.target.closest(".modal"));
    }

    function messageContainerSubmit(event){
        event.preventDefault();
        let target_class = event.target.className.split(" ")[0];
        form_submit?.[target_class]?.(event.target);
    }

    const form_submit = {
        message_form: addComment,
        update_message_form: updateMessage,
        update_comment_form: updateComment,
    }

    function addComment(target_form){
        let target_container = target_form.closest(".message").querySelector(".comments_container");
        let new_comment_element = document.querySelector("#comment_template").cloneNode(true);
        let new_message = target_form.elements.content.value;
        let submit_btn = target_form.querySelector("button[type='submit']");

        new_comment_element.classList.remove("hide");
        new_comment_element.removeAttribute("id");
        new_comment_element.querySelector(".comment_content>p").textContent = new_message;
        target_container.prepend(new_comment_element);

        updateCommentsCount(target_form.closest(".message"));
        submit_btn.setAttribute("disabled", true);
        target_form.reset();
        target_form.querySelector("textarea").focus();
    }

    function updateMessage(target){
        let target_message_content = target.closest(".message").querySelector(".message_content");
        let new_message = target.elements.content.value;
        target_message_content.querySelector("p").textContent = new_message;
        target.classList.add("hide");
        target_message_content.classList.remove("hide");
    }

    function updateComment(target){
        let target_message_content = target.closest(".comment").querySelector(".comment_content");
        let new_message = target.elements.content.value;
        target_message_content.querySelector("p").textContent = new_message;
        target.classList.add("hide");
        target_message_content.classList.remove("hide");
    }

    /* Helper Functions */

    function toggleModal(modal_element){
        modal_element.classList.toggle("show");
    }

    function updateCommentsCount(message_container){
        let count_element = message_container.querySelector(".message_actions .message_comment span");
        let comment_container = message_container.querySelector(".comments_container");
        count_element.textContent = comment_container.children.length;
    }

    function updateMessagesCount(){
        let new_count = messages_container.children.length;
        document.querySelector("#message_count").textContent = new_count;
        if(new_count > 0){
            document.querySelector("#no_message").classList.add("hide");
        }
        else{
            document.querySelector("#no_message").classList.remove("hide");
        }
    }

    function validateInput(event){
        let target_input = event.target;
        let btn_submit = target_input.closest("form").querySelector("button[type='submit']");

        if(target_input.value.length !== 0){
            btn_submit.removeAttribute("disabled");
        }
        else{
            btn_submit.setAttribute("disabled", true);
        }
    }
});