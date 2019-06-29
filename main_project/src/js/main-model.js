class MainModel {
    constructor() {
        this.orders = [];
        this.categories = [];
        $.get("http://localhost:3001/categories/")
            .then((data) => {
                this.categories = data;
                this.onchange()
            });
        this.user = null;
        this.getPersonData().then(() => this.fetchOrders());
    }
    login(username, password) {
        $.post(
            "http://localhost:3001/auth/",
            JSON.stringify({ "username": username, "password": password }))
            .then((data, textStatus, jqXHR) => {
                if (jqXHR.status != 200) return;
                this.getPersonData();
            })
    }

    getPersonData() {
        return $.get("http://localhost:3001/users/me")
            .then((data, textStatus, jqXHR) => {
                if (jqXHR.status != 200) return;
                this.user = { "name": data.name, "lastName": data.lastName };
                this.onUserChange();
            });
    };

    fetchOrders() {
        $.get("http://localhost:3001/users/me/orders")
            .then((data) => {
                this.orders = data;
                this.onchange();
            })
    }

    addOrder(dishContext) {
        let order = mainModel.orders.find(element => element.dishId == dishContext.dish.id);
        if (order) {
            order.amount++;
        }
        else {
            mainModel.orders.push({ 
                dishId: dishContext.dish.id,
                amount: 1,
                dish: dishContext.dish
            })
        }
        this.postDish(dishContext.dish.id).then(()=>{this.onchange(); this.dishAdded()});
    }

    deleteOrder(dishContext) {
        let order = mainModel.orders.find(element => element.dishId == dishContext.dish.id);
        if (order && order.amount != 0) {
            order.amount--;
            this.deleteDish(dishContext.dish.id);
        }
        this.onchange()
    }

    postDish(dishId) {
        return $.post(
            "http://localhost:3001/users/me/orders",
            JSON.stringify({ "dishId": dishId })
        )
    }

    deleteDish(dishId) {
        $.ajax({
            url: 'http://localhost:3001/users/me/orders',
            type: 'DELETE',
            data: JSON.stringify({ "dishId": dishId })
        });
    }
}