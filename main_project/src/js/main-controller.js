class MainController {
    constructor(model, mainView, loginView) {
        this.mainView = mainView;
        this.loginView = loginView;
        this.model = model;
        model.onchange = function () {
            mainView.render(model);
        }
        model.onUserChange = function () {
            loginView.render(model);
        }
        mainView.onMinusClick = function (data) {
            model.deleteOrder(data)
        }
        mainView.onPlusClick = function (data) {
            model.addOrder(data)
        }
        loginView.onLoginClick = function (username, password) {
            model.login(username, password)
        }
    }
}