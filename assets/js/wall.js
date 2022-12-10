window.addEventListener("load", () => {

    let selected_element;
    const message_template = document.querySelector("#message_template");
    const comment_template = document.querySelector("#comment_template");

    const messages_container = document.querySelector("#messages_container");
    const message_count = document.querySelector("#message_count");
    const no_message = document.querySelector("#no_message");
    const modal_buttons = document.querySelectorAll(".modal_btn");

    const create_message_btn = document.querySelector("#btn_create");
    const create_message_form = document.querySelector("#create_message_form");
    const delete_message_form = document.querySelector("#delete_message_form");
    const delete_comment_form = document.querySelector("#delete_comment_form");

    /* Toggling of Modals */
    modal_buttons.forEach(modal_button => {
        modal_button.addEventListener("click", () => modal_button_click(modal_button));
    });
    document.addEventListener("click", close_modal_click);

    /* Event Delegation For Form Submit */
    messages_container.addEventListener("submit", message_container_submit)

    /* Creating Message */
    create_message_btn.addEventListener("click", textarea_focus)
    create_message_form.addEventListener("submit", add_message_submit);
    create_message_form.querySelector("textarea").addEventListener("input", validate_input);

    /* Deleting Message */
    delete_message_form.addEventListener("submit", delete_message_form_submit);
    
    /* Deleting Comment */
    delete_comment_form.addEventListener("submit", delete_comment_form_submit);

    function add_message_submit(event){
        event.preventDefault();
        let target_form = event.target; 
        let new_message_element = message_template.cloneNode(true);
        let new_message = target_form.elements.content.value;
        let submit_btn = target_form.querySelector("button[type='submit']");

        new_message_element.classList.remove("hide");
        new_message_element.removeAttribute("id");
        new_message_element.querySelector(".message_content>p").textContent = new_message;
        new_message_element.querySelector(".update_form textarea").value = new_message;
        new_message_element.querySelector(".update_form .cancel_edit").addEventListener("click", cancel_edit_click);
        new_message_element.querySelector(".message_actions").addEventListener("click", message_actions_click);
        new_message_element.querySelector(".update_form textarea").addEventListener("input", validate_input);
        new_message_element.querySelector(".message_form textarea").addEventListener("input", validate_input);
        messages_container.prepend(new_message_element);

        update_messages_count();
        submit_btn.setAttribute("disabled", true);
        target_form.reset();
        toggle_modal(target_form.closest(".modal"));
    }

    function message_actions_click(event){
        let target_class = event.target.className.split(" ")[0];
        message_control?.[target_class]?.(event.target);
    }

    const message_control = {
        message_comment: toggle_comment,
        message_delete: delete_message,
        message_edit: edit_form,
    };

    function delete_message_form_submit(event){
        event.preventDefault();
        toggle_modal(event.target.closest(".modal"));
        selected_element.remove();
        selected_element = null;
        update_messages_count();
    }

    function delete_comment_form_submit(event){
        event.preventDefault();
        let message_container = selected_element.parentNode.closest(".message");
        selected_element.remove();
        selected_element = null;
        update_comments_count(message_container);
        toggle_modal(event.target.closest(".modal"));
    }

    function modal_button_click(modal_button){
        const target_id = modal_button.getAttribute("data-target");
        const target_modal = document.querySelector(`#${target_id}`);
        toggle_modal(target_modal);
    }

    function close_modal_click(event){
        const target = event.target;
        if(
            target.matches(".modal") ||
            target.matches(".modal_close") || 
            target.matches(".modal_cancel")
        ){
            let target_modal = target.closest(".modal");
            toggle_modal(target_modal);

            if(target_modal.id === "create_modal"){
                target_modal.querySelector("textarea").value = "";
                target_modal.querySelector("button[type='submit']").setAttribute("disabled", true);
            }
        }
    }

    function comment_actions_click(event){
        let target_class = event.target.className.split(" ")[0];
        comment_control?.[target_class]?.(event.target);
    }

    const comment_control = {
        message_delete: delete_message,
        message_edit: edit_form,
    };

    function toggle_comment(target){
        let target_comment_container = target.closest(".message").querySelector(".message_comments");
        target_comment_container.classList.toggle("hide");
        target_comment_container.querySelector("form textarea").focus();
        target.classList.toggle("active");
    }

    function delete_message(target){
        let target_id = target.getAttribute("data-target");
        let target_modal = document.querySelector(`#${target_id}`);
        selected_element = target.closest(".message");
        toggle_modal(target_modal);
    }
        
    function edit_form(target){
        let target_message_content = target.closest(".message_content");
        let target_update_form = target.closest(".message").querySelector(".update_form");
        let target_textarea = target_update_form.querySelector("textarea")

        target_textarea.value = target_message_content.querySelector("p").textContent;

        target_message_content.classList.add("hide");
        target_update_form.classList.remove("hide");
        target_textarea.focus();
    }

    function cancel_edit_click(event) {
        let target_edit_button = event.target;
        target_edit_button.closest(".update_form").classList.add("hide");
        target_edit_button.closest(".message").querySelector('.message_content').classList.remove("hide");
    }

    function message_container_submit(event){
        event.preventDefault();
        let target_class = event.target.className.split(" ")[0];
        form_submit?.[target_class]?.(event.target);
    }

    const form_submit = {
        message_form: add_comment,
        update_form: update_comment,
    }

    function add_comment(target_form){
        let target_container = target_form.closest('.message').querySelector('.comments_container');
        let new_comment_element = comment_template.cloneNode(true);
        let new_message = target_form.elements.content.value;
        let submit_btn = target_form.querySelector("button[type='submit']");

        new_comment_element.classList.remove("hide");
        new_comment_element.removeAttribute("id");
        new_comment_element.querySelector(".message_content>p").textContent = new_message;
        new_comment_element.querySelector(".update_form textarea").value = new_message;
        new_comment_element.querySelector(".message_actions").addEventListener("click", comment_actions_click);
        new_comment_element.querySelector(".update_form .cancel_edit").addEventListener("click", cancel_edit_click);
        new_comment_element.querySelector(".update_form textarea").addEventListener("input", validate_input);
        target_container.prepend(new_comment_element);

        update_comments_count(target_form.closest('.message'));
        submit_btn.setAttribute("disabled", true);
        target_form.reset();
        target_form.querySelector("textarea").focus();
    }

    function update_comment(target){
        let target_message_content = target.closest('.message').querySelector('.message_content');
        let new_message = target.elements.content.value;
        target_message_content.querySelector("p").textContent = new_message;
        target.classList.add("hide");
        target_message_content.classList.remove("hide");
    }

    /* Helper Functions */

    function textarea_focus(){
        create_message_form.querySelector("textarea").focus();
    }

    function toggle_modal(modal_element){
        modal_element.classList.toggle("show");
    }

    function update_comments_count(message_container){
        let count_element = message_container.querySelector(".message_actions .message_comment span")
        let comment_container = message_container.querySelector(".comments_container");
        count_element.textContent = comment_container.children.length;
    }

    function update_messages_count(){
        let new_count = messages_container.children.length;
        message_count.textContent = new_count;
        if(new_count > 0){
            no_message.classList.add("hide");
        }
        else {
            no_message.classList.remove("hide");
        }
    }

    function validate_input(event){
        let target_input = event.target;
        let btn_submit = target_input.closest("form").querySelector("button[type='submit']");

        if(target_input.value.length !== 0){
            btn_submit.removeAttribute("disabled");
        }
        else {
            btn_submit.setAttribute("disabled", true);
        }
    }
});