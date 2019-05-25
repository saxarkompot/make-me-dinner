class ProfileView {
    constructor() {
        $(".profile").click(() => this.onProfileClick())
    }
    render(model, hide) {
        let divOfUser = $(".middle-profile");
        if (hide) {
            divOfUser.hide(); // clear a div before filling it
        }
        else {
            divOfUser.show();
        }        
        divOfUser.html($("<div/>").html(`${model.user.name}${model.user.lastName}`));
    }
}