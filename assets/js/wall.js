window.addEventListener("load", () => {

    let selected_element;
    const messages_container = document.querySelector("#messages_container");
    const create_message_form = document.querySelector("#create_message_form");

    /* Toggling of Modals */
    document.addEventListener("click", closeModalClick);

    /* Event Delegation For Form Submit */
    messages_container.addEventListener("submit", messageContainerSubmit);

    /* Creating Message */
    document.querySelector("#btn_create").addEventListener("click", createMessageClick);
    create_message_form.addEventListener("submit", addMessageSubmit);
    create_message_form.querySelector("textarea").addEventListener("input", validateInput);

    /* Deleting Message */
    document.querySelector("#delete_message_form").addEventListener("submit", deleteMessageFormSubmit);
    
    /* Deleting Comment */
    document.querySelector("#delete_comment_form").addEventListener("submit", deleteCommentFormSubmit);

    function addMessageSubmit(event){
        event.preventDefault();
        let target_form = event.target; 
        let new_message_element = document.querySelector("#message_template").cloneNode(true);
        let new_message = target_form.elements.content.value;
        let submit_btn = target_form.querySelector("button[type='submit']");

        new_message_element.classList.remove("hide");
        new_message_element.removeAttribute("id");
        new_message_element.querySelector(".message_content>p").textContent = new_message;
        new_message_element.querySelector(".update_form textarea").value = new_message;
        new_message_element.querySelector(".update_form .cancel_edit").addEventListener("click", cancelEditClick);
        new_message_element.querySelector(".message_actions").addEventListener("click", messageActionsClick);
        new_message_element.querySelector(".update_form textarea").addEventListener("input", validateInput);
        new_message_element.querySelector(".message_form textarea").addEventListener("input", validateInput);
        messages_container.prepend(new_message_element);

        updateMessagesCount();
        submit_btn.setAttribute("disabled", true);
        target_form.reset();
        toggleModal(target_form.closest(".modal"));
    }

    function messageActionsClick(event){
        let target_class = event.target.className.split(" ")[0];
        message_control?.[target_class]?.(event.target);
    }

    const message_control = {
        message_comment: toggleComment,
        message_delete: deleteMessage,
        message_edit: editForm,
    };

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

    function commentActionsClick(event){
        let target_class = event.target.className.split(" ")[0];
        comment_control?.[target_class]?.(event.target);
    }

    const comment_control = {
        message_delete: deleteMessage,
        message_edit: editForm,
    };

    function toggleComment(target){
        let target_comment_container = target.closest(".message").querySelector(".message_comments");
        target_comment_container.classList.toggle("hide");
        target_comment_container.querySelector("form textarea").focus();
        target.classList.toggle("active");
    }

    function deleteMessage(target){
        let target_id = target.getAttribute("data-target");
        let target_modal = document.querySelector(`#${target_id}`);
        selected_element = target.closest(".message");
        toggleModal(target_modal);
    }
        
    function editForm(target){
        let target_message_content = target.closest(".message_content");
        let target_update_form = target.closest(".message").querySelector(".update_form");
        let target_textarea = target_update_form.querySelector("textarea")

        target_textarea.value = target_message_content.querySelector("p").textContent;

        target_message_content.classList.add("hide");
        target_update_form.classList.remove("hide");
        target_textarea.focus();
    }

    function cancelEditClick(event){
        let target_edit_button = event.target;
        target_edit_button.closest(".update_form").classList.add("hide");
        target_edit_button.closest(".message").querySelector(".message_content").classList.remove("hide");
    }

    function messageContainerSubmit(event){
        event.preventDefault();
        let target_class = event.target.className.split(" ")[0];
        form_submit?.[target_class]?.(event.target);
    }

    const form_submit = {
        message_form: addComment,
        update_form: updateContent,
    }

    function addComment(target_form){
        let target_container = target_form.closest(".message").querySelector(".comments_container");
        let new_comment_element = document.querySelector("#comment_template").cloneNode(true);
        let new_message = target_form.elements.content.value;
        let submit_btn = target_form.querySelector("button[type='submit']");

        new_comment_element.classList.remove("hide");
        new_comment_element.removeAttribute("id");
        new_comment_element.querySelector(".message_content>p").textContent = new_message;
        new_comment_element.querySelector(".update_form textarea").value = new_message;
        new_comment_element.querySelector(".message_actions").addEventListener("click", commentActionsClick);
        new_comment_element.querySelector(".update_form .cancel_edit").addEventListener("click", cancelEditClick);
        new_comment_element.querySelector(".update_form textarea").addEventListener("input", validateInput);
        target_container.prepend(new_comment_element);

        updateCommentsCount(target_form.closest(".message"));
        submit_btn.setAttribute("disabled", true);
        target_form.reset();
        target_form.querySelector("textarea").focus();
    }

    function updateContent(target){
        let target_message_content = target.closest(".message").querySelector(".message_content");
        let new_message = target.elements.content.value;
        target_message_content.querySelector("p").textContent = new_message;
        target.classList.add("hide");
        target_message_content.classList.remove("hide");
    }

    /* Helper Functions */

    function createMessageClick(){
        toggleModal(document.querySelector(`#create_modal`));
        create_message_form.querySelector("textarea").focus();
    }

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