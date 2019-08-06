import DataProvider from "./data-provider.js";
const dataProvider = DataProvider.getInstanse();
import CategoriesListComponent from "./categories-list-component.js";
const categoryListComponent = new CategoriesListComponent($('.category-1'));

function fetchCategories() {
    dataProvider.getAllCategories().then(function () {
        categoryListComponent.renderAllCategories()
    });
    categoryListComponent.addCategory();
};

fetchCategories();

