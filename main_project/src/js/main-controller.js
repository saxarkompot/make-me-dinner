class MainController {
    constructor(model, mainView, loginView, profileView) {
        this.mainView = mainView;
        this.loginView = loginView;
        this.model = model;
        model.dishAdded = function () {
            cartLink.blink();
        }
        model.onchange = function (){
            mainView.render(model, activeView != mainView);
            cartView.render(model, activeView != cartView);
            cartLink.render(model);  
        }
        model.onUserChange = function () {
            loginView.render(model);
            profileView.render(model, activeView != profileView);
        }
        function onMinusClick(data) {
            model.deleteOrder(data)
        }
        cartView.onMinusClick = onMinusClick;
        mainView.onMinusClick = onMinusClick;

        function onPlusClick(data) {
            model.addOrder(data);
            cartLink.blink();
        }
        cartView.onPlusClick = onPlusClick;
        mainView.onPlusClick = onPlusClick;

        loginView.onLoginClick = function (username, password) {
            model.login(username, password)
        }
        cartView.onCartClick = function () {
            activeView = activeView == cartView ? mainView : cartView;
            showActiveView();            
            window.location.hash = activeView == cartView ? "cart" : "";            
        }
        profileView.onProfileClick = function () {
            activeView = activeView != profileView ? profileView : mainView;
            showActiveView();
            window.location.hash = activeView == profileView ? "profile" : "";
        }
        function showActiveView() {
            mainView.render(model, activeView != mainView);
            cartView.render(model, activeView != cartView);
            profileView.render(model, activeView != profileView);
        }
        let activeView;
        if(window.location.hash == "#cart"){
            activeView = cartView;
        }
        else if(window.location.hash == "#profile"){
            activeView = profileView;
        }
        else{
            activeView = mainView;
        }
        showActiveView();
        loginView.render(model);     
        cartLink.render(model);         
    }
}