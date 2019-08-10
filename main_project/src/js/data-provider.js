const host = "http://localhost:3001";
const singleton = Symbol('singleton');
const singletonEnforcer = Symbol('singletonEnforcer');
class DataProvider {
    constructor(enforcer) {
        this.arrayOfCategories = []
        if (enforcer != singletonEnforcer) {
            throw Error("no-no-no")
        }
    }
    static getInstanse() {
        if (!this[singleton]) {
            return this[singleton] = new DataProvider(singletonEnforcer)
        }
        else {
            return this[singleton]
        }
    }
    getCategoryById(selectedCategoryId) {
        return this.arrayOfCategories.find((e) => e.id == selectedCategoryId)
    }
    async getAllCategories() {
        var data = await $.get(`${host}/categories`);
        this.arrayOfCategories = data;
    }
    async putCategory(impValue) {
        var data = await $.post(`${host}/categories/`, { name: `${impValue}` });
        data.dishes = [];
        this.arrayOfCategories.push(data);
        return data;
    }
    async putDish(impValue, selectedCategoryId) {
        var data = await $.post(`${host}/categories/${selectedCategoryId}/dishes`, { name: `${impValue}` });
        this.getCategoryById(selectedCategoryId).dishes.push(data);
        return data;
    }
    async removeCategory(id) {
        await $.ajax({
            url: `${host}/categories/${id}`,
            type: 'DELETE',
            data: JSON.stringify({ "id": id })
        });
        for (let element of this.arrayOfCategories) {
            if (element.id == id) {
                this.arrayOfCategories.splice(element, 1);
                break;
            }
        }
    }
    async removeDish(categoryId, dishId) {
        await $.ajax({
            url: `${host}/categories/${categoryId}/dishes/${dishId}`,
            type: 'DELETE',
            data: JSON.stringify({ "id": dishId })
        });
        for (let i = 0; i < this.arrayOfCategories.length; i++) {
            if (this.arrayOfCategories[i].id == categoryId) {
                let dish = this.arrayOfCategories[i].dishes;
                for (let d = 0; d < dish.length; d++) {
                    if (dish[d].id == dishId) {
                        this.arrayOfCategories[i].dishes.splice(d, 1);
                        break;
                    }
                }
            }
        }
    }
    async updateCategory(categoryId, newValue) {
        await $.ajax({
            url: `${host}/categories/${categoryId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ "name": newValue })
        });
        for (let i = 0; i < this.arrayOfCategories.length; i++) {
            if (this.arrayOfCategories[i].id == categoryId) {
                this.arrayOfCategories[i].name = newValue;
                break;
            }
        }
    }
    async updateImage(selectedCategoryId, formData) {
        var data = await $.ajax({
            url: `${host}/categories/${selectedCategoryId}/images/`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
        });
        this.getCategoryById(selectedCategoryId).imageUrl = data.imageUrl;
        return data
    }
}

export default DataProvider;