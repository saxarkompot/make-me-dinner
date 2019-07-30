const host = "http://localhost:3001";
let dataProvider = {
    arrayOfCategories: [],
    getAllCategories: async function () {
        var data = await $.get(`${host}/categories`);
        dataProvider.arrayOfCategories = data;
    },
    putCategory: async function (impValue) {
        var data = await $.post(`${host}/categories/`, { name: `${impValue}` });
        data.dishes = [];
        dataProvider.arrayOfCategories.push(data);
        return data;
    },
    putDish: async function (impValue, selectedCategoryId) {
        var data = await $.post(`${host}/categories/${selectedCategoryId}/dishes`, { name: `${impValue}` });
        dataProvider.arrayOfCategories.find((e) => e.id == selectedCategoryId).dishes.push(data);
        return data;
    },
    removeCategory: async function (id) {
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
    },
    removeDish: async function (categoryId, dishId) {
        await $.ajax({
            url: `${host}/categories/${categoryId}/dishes/${dishId}`,
            type: 'DELETE',
            data: JSON.stringify({ "id": dishId })
        });
        for (let i = 0; i < dataProvider.arrayOfCategories.length; i++) {
            if (dataProvider.arrayOfCategories[i].id == categoryId) {
                let dish = dataProvider.arrayOfCategories[i].dishes;
                for (let d = 0; d < dish.length; d++) {
                    if (dish[d].id == dishId) {
                        dataProvider.arrayOfCategories[i].dishes.splice(d, 1);
                        break;
                    }
                }
            }
        }
    },
    updateCategory: async function (categoryId, newValue) {
        var data = await $.ajax({
            url: `${host}/categories/${categoryId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ "name": newValue })
        })
        for (let i = 0; i < dataProvider.arrayOfCategories.length; i++) {
            if (dataProvider.arrayOfCategories[i].id == categoryId) {
                dataProvider.arrayOfCategories[i] = data;
                break;
            }
        }
    },
    updateImage: async function (selectedCategoryId, formData) {
        var data = await $.ajax({
            url: `${host}/categories/${selectedCategoryId}/images/`,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
        });
        dataProvider.arrayOfCategories.find((e) => e.id == selectedCategoryId).imageUrl = data.imageUrl;
        return data
    }
}

export default dataProvider;