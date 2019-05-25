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
function toPortray() {
}

let mainView = new MainView();
let mainModel = new MainModel();
let loginView = new LoginView();
let cartView = new CartView();
let mainController = new MainController(mainModel, mainView, loginView);