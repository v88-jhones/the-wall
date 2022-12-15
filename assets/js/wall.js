window.addEventListener("load", () => {

    let create_message_form = document.querySelector("#create_message_form");

    /* Toggling of Modals */
    document.addEventListener("click", clickCloseModal);

    /* Creating Message */
    document.querySelector("#btn_create").addEventListener("click", createMessageClick);
    create_message_form.addEventListener("submit", submitAddMessage);
    create_message_form.querySelector("textarea").addEventListener("input", inputValidate);

    /* Deleting Message */
    document.querySelector("#delete_message_form").addEventListener("submit", submitDeleteMessage);
    
    /* Deleting Comment */
    document.querySelector("#delete_comment_form").addEventListener("submit", submitDeleteComment);

});

/**
* DOCU: Will add new message to the messages container. <br>
* Triggered: When create message form is submitted.
* @function
* @param {object} event - To target the create message form.
* @author Jhones 
*/
function submitAddMessage(event){
    event.preventDefault();
    let create_message_form = event.target; 
    let new_message = document.querySelector("#message_template").cloneNode(true);
    let new_content = create_message_form.elements.content.value;
    let submit_btn = create_message_form.querySelector("button[type='submit']");

    /* Modifying the attributes, classes and text content of the new message */
    new_message.classList.remove("hide");
    new_message.removeAttribute("id");
    new_message.setAttribute("data-message-id", generateId());
    new_message.querySelector(".message_content>p").textContent = new_content;

    /* Adding event Listeners for new message */
    new_message.querySelector(".update_form").addEventListener("submit", submitUpdateContent);
    new_message.querySelector(".update_form .cancel_edit").addEventListener("click", clickCancelEdit);
    new_message.querySelector(".update_form textarea").addEventListener("input", inputValidate);
    new_message.querySelector(".message_form").addEventListener("submit", submitAddComment);
    new_message.querySelector(".message_form textarea").addEventListener("input", inputValidate);
    new_message.querySelector(".message_actions .message_comment").addEventListener("click", clickCommentBtn);
    new_message.querySelector(".message_actions .message_edit").addEventListener("click", clickEditBtn);
    new_message.querySelector(".message_actions .message_delete").addEventListener("click", clickDeleteMessageBtn);
    
    /* Prepend the new message and reset form and modal */
    document.querySelector("#messages_container").prepend(new_message);
    updateMessagesCount();
    submit_btn.setAttribute("disabled", true);
    create_message_form.reset();
    toggleModal(create_message_form.closest(".modal"));
}

/**
* DOCU: Will remove the message through data-message-id. <br>
* Triggered: When delete message form is submitted.
* @function
* @param {object} event - To target the delete message form.
* @author Jhones 
*/
function submitDeleteMessage(event){
    event.preventDefault();
    let delete_message_form = event.target;
    let message_id = delete_message_form.elements.message_id.value;
    document.querySelector("li[data-message-id='" + message_id + "']").remove();
    updateMessagesCount();
    toggleModal(delete_message_form.closest(".modal"));
}

/**
* DOCU: Will remove the comment from message container through data-comment-id. <br>
* Triggered: When delete comment form is submitted.
* @function
* @param {object} event - To target the delete comment form.
* @author Jhones 
*/
function submitDeleteComment(event){
    event.preventDefault();
    let delete_comment_form = event.target;
    let comment_id = delete_comment_form.elements.comment_id.value;
    let comment = document.querySelector("li[data-comment-id='" + comment_id + "']");
    let message = comment.parentNode.closest(".message");
    comment.remove();
    updateCommentsCount(message);
    toggleModal(delete_comment_form.closest(".modal"));
}

/**
* DOCU: Will close the modal. <br>
* Triggered: When clicked the document and it matches the modal classes.
* @function
* @param {object} event - To target the modal classes.
* @author Jhones 
*/
function clickCloseModal(event){
    let target = event.target;
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

/**
* DOCU: Will toggle comment container in message. <br>
* Triggered: When comment button is clicked.
* @function
* @param {object} event - To target the comment button that triggered the function.
* @author Jhones 
*/
function clickCommentBtn(event){
    let comment_btn = event.target;
    let comment_container = comment_btn.closest(".message").querySelector(".message_comments");
    comment_container.classList.toggle("hide");
    comment_container.querySelector("form textarea").focus();
    comment_container.querySelector("form textarea").value = "";
    comment_container.querySelector("form button[type='submit']").setAttribute("disabled", true);
    comment_btn.classList.toggle("active");
}

/**
* DOCU: Will open delete message form modal and set data-message-id in it's hidden input. <br>
* Triggered: When delete message button is clicked.
* @function
* @param {object} event - To target the delete message button that triggered the function.
* @author Jhones 
*/
function clickDeleteMessageBtn(event){
    event.preventDefault();
    let delete_btn = event.target;
    let target_modal = document.querySelector("#delete_message_modal");
    let message_id = delete_btn.closest(".message").getAttribute("data-message-id");
    target_modal.querySelector("form input[name='message_id']").value = message_id;
    toggleModal(target_modal);
}

/**
* DOCU: Will open delete comment form modal and set data-comment-id in it's hidden input. <br>
* Triggered: When delete comment button is clicked.
* @function
* @param {object} event - To target the delete comment button that triggered the function.
* @author Jhones 
*/
function clickDeleteCommentBtn(event){
    event.preventDefault();
    let delete_btn = event.target;
    let target_modal = document.querySelector("#delete_comment_modal");
    let comment_id = delete_btn.closest(".message").getAttribute("data-comment-id");
    target_modal.querySelector("form input[name='comment_id']").value = comment_id;
    toggleModal(target_modal);
}
    
/**
* DOCU: Will show update form and hide the content. <br>
* Triggered: When Edit button is clicked.
* @function
* @param {object} event - To target the edit button that triggered the function.
* @author Jhones 
*/
function clickEditBtn(event){
    let edit_btn = event.target;
    let message_content = edit_btn.closest(".message_content");
    let update_form = edit_btn.closest(".message").querySelector(".update_form");
    let textarea = update_form.querySelector("textarea");

    update_form.querySelector("button[type='submit']").removeAttribute("disabled");
    textarea.value = message_content.querySelector("p").textContent;
    message_content.classList.add("hide");
    update_form.classList.remove("hide");
    textarea.focus();
}

/**
* DOCU: Will hide update form and show the content. <br>
* Triggered: When cancel button is clicked from the update form.
* @function
* @param {object} event - To target edit button that triggered the function.
* @author Jhones 
*/
function clickCancelEdit(event){
    let edit_button = event.target;
    edit_button.closest(".update_form").classList.add("hide");
    edit_button.closest(".message").querySelector(".message_content").classList.remove("hide");
}

/**
* DOCU: Will add comment to the message. <br>
* Triggered: When create comment form is submitted .
* @function
* @param {object} event - To target the add comment form.
* @author Jhones 
*/
function submitAddComment(event){
    event.preventDefault();
    let add_comment_form = event.target;
    let comment_container = add_comment_form.closest(".message").querySelector(".comments_container");
    let new_comment = document.querySelector("#comment_template").cloneNode(true);
    let new_content = add_comment_form.elements.content.value;
    let submit_btn = add_comment_form.querySelector("button[type='submit']");

    /* Modifying the attributes, classes and text content of the new comment */
    new_comment.classList.remove("hide");
    new_comment.removeAttribute("id");
    new_comment.setAttribute("data-comment-id", generateId());
    new_comment.querySelector(".message_content>p").textContent = new_content;

    /* Adding event listeners for new comment */
    new_comment.querySelector(".message_actions .message_edit").addEventListener("click", clickEditBtn);
    new_comment.querySelector(".message_actions .message_delete").addEventListener("click", clickDeleteCommentBtn);
    new_comment.querySelector(".update_form .cancel_edit").addEventListener("click", clickCancelEdit);
    new_comment.querySelector(".update_form textarea").addEventListener("input", inputValidate);
    new_comment.querySelector(".update_form").addEventListener("submit", submitUpdateContent);
    comment_container.prepend(new_comment);

    /* Prepend the new comment and reset form */
    updateCommentsCount(add_comment_form.closest(".message"));
    submit_btn.setAttribute("disabled", true);
    add_comment_form.reset();
    add_comment_form.querySelector("textarea").focus();
}

/**
* DOCU: Will update the content of the target element. <br>
* Triggered: When update form is submitted.
* @function
* @param {object} event - To target update form that triggered the function.
* @author Jhones 
*/
function submitUpdateContent(event){
    event.preventDefault();
    let update_form = event.target;
    let message_content = update_form.closest(".message").querySelector(".message_content");
    let new_content = update_form.elements.content.value;

    message_content.querySelector("p").textContent = new_content;
    update_form.classList.add("hide");
    message_content.classList.remove("hide");
}

/**
* DOCU: Will open the create message form modal. <br>
* Triggered: When create message button is clicked.
* @function
* @author Jhones 
*/
function createMessageClick(){
    toggleModal(document.querySelector(`#create_modal`));
    create_message_form.querySelector("textarea").focus();
}

/**
* DOCU: Will toggle the modal. <br>
* Triggered: When forms in modal is submitted or in modal classes click events.
* @function
* @param {object} modal_element - Modal element that we want to toggle.
* @author Jhones 
*/
function toggleModal(modal_element){
    modal_element.classList.toggle("show");
}

/**
* DOCU: Will update the comments count based on length of child elements of current comment container. <br>
* Triggered: When new comment is added or removed.
* @function
* @param {object} message_container - The current message that we want to update the comment count.
* @author Jhones 
*/
function updateCommentsCount(message_container){
    let count_element = message_container.querySelector(".message_actions .message_comment span");
    let comment_container = message_container.querySelector(".comments_container");
    count_element.textContent = comment_container.children.length;
}

/**
* DOCU: Will update the message count based on length of child elements of messages container. <br>
* Triggered: When new message is added or removed.
* @function
* @author Jhones 
*/
function updateMessagesCount(){
    let new_count = document.querySelector("#messages_container").children.length;
    document.querySelector("#message_count").textContent = new_count;
    if(new_count > 0){
        document.querySelector("#no_message").classList.add("hide");
    }
    else{
        document.querySelector("#no_message").classList.remove("hide");
    }
}

/**
* DOCU: Will validate the input field by disabling the submit button. <br>
* Triggered: When the input field changes it's value.
* @function
* @param {object} event - To target the input element.
* @author Jhones 
*/
function inputValidate(event){
    let input = event.target;
    let btn_submit = input.closest("form").querySelector("button[type='submit']");
    
    /* Will disable submit button if the input length is less than 1 */
    if(input.value.length < 1){
        btn_submit.setAttribute("disabled", true);
    }
    else{
        btn_submit.removeAttribute("disabled");
    }
}

/**
* DOCU: Will generate random number for id purposes. <br>
* Triggered: When new message or comment is added.
* @function
* @returns {number} - The random generated id.
* @author Jhones 
*/
function generateId(){
    return Math.ceil(Date.now() + Math.random());
}