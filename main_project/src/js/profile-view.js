class ProfileView {
    constructor() {
        $(".profile a:first-child").click(() => {this.onProfileClick(); return false})
    }
    render(model, hide) {
        let divOfUser = $(".middle-profile");
        if (hide) {
            divOfUser.hide(); // clear a div before filling it
        }
        else {
            divOfUser.show();
        }
        if (model.user) {
            divOfUser.html($("<div/>").html(`${model.user.name}${model.user.lastName}`));
        }
    }
}

