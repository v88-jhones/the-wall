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

function submitAddMessage(event){
    event.preventDefault();
    let create_message_form = event.target; 
    let new_message = document.querySelector("#message_template").cloneNode(true);
    let new_content = create_message_form.elements.content.value;
    let submit_btn = create_message_form.querySelector("button[type='submit']");

    new_message.classList.remove("hide");
    new_message.removeAttribute("id");
    new_message.setAttribute("data-message-id", generateId());
    new_message.querySelector(".message_content>p").textContent = new_content;
    new_message.querySelector(".update_form").addEventListener("submit", submitUpdateContent);
    new_message.querySelector(".update_form .cancel_edit").addEventListener("click", clickCancelEdit);
    new_message.querySelector(".update_form textarea").addEventListener("input", inputValidate);
    new_message.querySelector(".message_form").addEventListener("submit", submitAddComment);
    new_message.querySelector(".message_form textarea").addEventListener("input", inputValidate);
    new_message.querySelector(".message_actions .message_comment").addEventListener("click", clickCommentBtn);
    new_message.querySelector(".message_actions .message_edit").addEventListener("click", clickEditBtn);
    new_message.querySelector(".message_actions .message_delete").addEventListener("click", clickDeleteMessageBtn);
    document.querySelector("#messages_container").prepend(new_message);

    updateMessagesCount();
    submit_btn.setAttribute("disabled", true);
    create_message_form.reset();
    toggleModal(create_message_form.closest(".modal"));
}

function submitDeleteMessage(event){
    event.preventDefault();
    let delete_message_form = event.target;
    let message_id = delete_message_form.elements.message_id.value;
    document.querySelector("li[data-message-id='" + message_id + "']").remove();
    updateMessagesCount();
    toggleModal(delete_message_form.closest(".modal"));
}

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

function clickCommentBtn(event){
    let comment_btn = event.target;
    let comment_container = comment_btn.closest(".message").querySelector(".message_comments");
    comment_container.classList.toggle("hide");
    comment_container.querySelector("form textarea").focus();
    comment_container.querySelector("form textarea").value = "";
    comment_container.querySelector("form button[type='submit']").setAttribute("disabled", true);
    comment_btn.classList.toggle("active");
}

function clickDeleteMessageBtn(event){
    event.preventDefault();
    let delete_btn = event.target;
    let target_modal = document.querySelector("#delete_message_modal");
    let message_id = delete_btn.closest(".message").getAttribute("data-message-id");
    target_modal.querySelector("form input[name='message_id']").value = message_id;
    toggleModal(target_modal);
}

function clickDeleteCommentBtn(event){
    event.preventDefault();
    let delete_btn = event.target;
    let target_modal = document.querySelector("#delete_comment_modal");
    let comment_id = delete_btn.closest(".message").getAttribute("data-comment-id");
    target_modal.querySelector("form input[name='comment_id']").value = comment_id;
    toggleModal(target_modal);
}
    
function clickEditBtn(event){
    event.preventDefault();
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

function clickCancelEdit(event){
    let edit_button = event.target;
    edit_button.closest(".update_form").classList.add("hide");
    edit_button.closest(".message").querySelector(".message_content").classList.remove("hide");
}

function submitAddComment(event){
    event.preventDefault();
    let add_comment_form = event.target;
    let comment_container = add_comment_form.closest(".message").querySelector(".comments_container");
    let new_comment = document.querySelector("#comment_template").cloneNode(true);
    let new_content = add_comment_form.elements.content.value;
    let submit_btn = add_comment_form.querySelector("button[type='submit']");

    new_comment.classList.remove("hide");
    new_comment.removeAttribute("id");
    new_comment.setAttribute("data-comment-id", generateId());
    new_comment.querySelector(".message_content>p").textContent = new_content;
    new_comment.querySelector(".message_actions .message_edit").addEventListener("click", clickEditBtn);
    new_comment.querySelector(".message_actions .message_delete").addEventListener("click", clickDeleteCommentBtn);
    new_comment.querySelector(".update_form .cancel_edit").addEventListener("click", clickCancelEdit);
    new_comment.querySelector(".update_form textarea").addEventListener("input", inputValidate);
    new_comment.querySelector(".update_form").addEventListener("submit", submitUpdateContent);
    comment_container.prepend(new_comment);

    updateCommentsCount(add_comment_form.closest(".message"));
    submit_btn.setAttribute("disabled", true);
    add_comment_form.reset();
    add_comment_form.querySelector("textarea").focus();
}

function submitUpdateContent(event){
    event.preventDefault();
    let update_form = event.target;
    let message_content = update_form.closest(".message").querySelector(".message_content");
    let new_content = update_form.elements.content.value;

    message_content.querySelector("p").textContent = new_content;
    update_form.classList.add("hide");
    message_content.classList.remove("hide");
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
    let new_count = document.querySelector("#messages_container").children.length;
    document.querySelector("#message_count").textContent = new_count;
    if(new_count > 0){
        document.querySelector("#no_message").classList.add("hide");
    }
    else{
        document.querySelector("#no_message").classList.remove("hide");
    }
}

function inputValidate(event){
    let input = event.target;
    let btn_submit = input.closest("form").querySelector("button[type='submit']");

    if(input.value.length !== 0){
        btn_submit.removeAttribute("disabled");
    }
    else{
        btn_submit.setAttribute("disabled", true);
    }
}

function generateId(){
    return Math.ceil(Date.now() + Math.random());
}