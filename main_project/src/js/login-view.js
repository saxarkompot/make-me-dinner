class LoginView {
    render(model) {
        let $email = $("#exampleInputEmail1");
        let $password = $("#exampleInputPassword1");
        let $buttonSend = $("#btn-send");
        if (!this._isLoginSubscribed) {
            $buttonSend.click(() => this.onLoginClick($email.val(), $password.val()));
            this._isLoginSubscribed = true;
        }

        if (model.user) {
            let $helloDiv = $("<div class='hello-text'/>");
            $(".form").replaceWith($helloDiv.html(`Hello <span class="person-name">${model.user.name} ${model.user.lastName}</span> !`));
        }
    }
}