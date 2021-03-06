$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true
  },
  headers: {
    "Content-Type": "application/json"
  },
  dataType: "json"
});

let mainView = new MainView();
let mainModel = new MainModel();
let loginView = new LoginView();
let cartView = new CartView();
let cartLink = new CartLink();
let profileView = new ProfileView();
let mainController = new MainController(mainModel, mainView, loginView, profileView);