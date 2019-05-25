class MainController {
    constructor(model, mainView, loginView, profileView) {
        this.mainView = mainView;
        this.loginView = loginView;
        this.model = model;
        model.onchange = function () {
            mainView.render(model, activeView != mainView);
            cartView.render(model, activeView != cartView);
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
            activeView = activeView == cartView ? mainView : cartView;
            showActiveView();
        }
        profileView.onProfileClick = function () {
            activeView = activeView != profileView ? profileView : mainView;
            showActiveView();
        }
        function showActiveView() {
            mainView.render(model, activeView != mainView);
            cartView.render(model, activeView != cartView);
            profileView.render(model, activeView != profileView);
        }
        let activeView = mainView;
        showActiveView();
        loginView.render(model);        
    }
}