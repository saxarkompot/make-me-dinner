class MainController {
    constructor(model, mainView, loginView) {
        this.mainView = mainView;
        this.loginView = loginView;
        this.model = model;
        model.onchange = function () {
            mainView.render(model, showCartView);
            cartView.render(model, !showCartView);
        }
        model.onUserChange = function () {
            loginView.render(model);
        }
        function onMinusClick(data) {
            model.deleteOrder(data)
        }
        cartView.onMinusClick = onMinusClick;
        mainView.onMinusClick = onMinusClick;

        function onPlusClick(data) {
            model.addOrder(data)
        }
        cartView.onPlusClick = onPlusClick;
        mainView.onPlusClick = onPlusClick;

        loginView.onLoginClick = function (username, password) {
            model.login(username, password)
        }
        cartView.onCartClick = function () {
            showCartView = !showCartView;
            mainView.render(model, showCartView);
            cartView.render(model, !showCartView);            
        }
        let showCartView = false;
        mainView.render(model, showCartView);
        loginView.render(model);
        cartView.render(model, !showCartView);
    }
}