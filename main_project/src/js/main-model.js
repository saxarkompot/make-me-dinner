class MainModel {
    constructor() {
        this.orders = [];
        this.categories = [];
        $.get("http://localhost:3001/categories/", (data) => {
            this.categories = data;
            this.onchange()
        });
        this.user = null;
        this.getPersonData();
    }
    login(username, password) {
        $.post(
            "http://localhost:3001/auth/",
            JSON.stringify({ "username": username, "password": password }),
            (data, textStatus, jqXHR) => {
                if (jqXHR.status != 200) return;
                this.getPersonData();
            })
    }

    getPersonData() {
        $.get("http://localhost:3001/users/me", (data, textStatus, jqXHR) => {
            if (jqXHR.status != 200) return;
            this.user = { "name": data.name, "lastName": data.lastName };
            this.onUserChange();
            this.fetchOrders();            
        });
    };

    fetchOrders() {
        $.get("http://localhost:3001/users/me/orders", (data) => {
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
            mainModel.orders.push({ dishId: dishContext.dish.id, amount: 1, dish: dishContext.dish })
        }
        this.postDish(dishContext.dish.id);
        this.onchange()
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
        $.post(
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