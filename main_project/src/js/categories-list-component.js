import DataProvider from "./data-provider.js";
const dataProvider = DataProvider.getInstanse();
import CategoryComponent from "./category-component.js";
import myTooltip from "./my-tooltip.js";
import DishComponent from "./dish-component.js";

const dishComponent = new DishComponent($('.category-3'));
const categoryComponent = new CategoryComponent($('.category-2'), dishComponent);
const categories = $('.div-of-categories');

class CategoryListComponent {
    constructor(uiContainer) {
        this._uiContainer = uiContainer;
        this._categoryId = null;
    }
    renderAllCategories() {
        for (let i = 0; i < dataProvider.arrayOfCategories.length; i++) {
            this.renderCategory(dataProvider.arrayOfCategories[i].id, dataProvider.arrayOfCategories[i].name);
        };
    }
    renderCategory(categoryId, categoryName) {
        let self = this;
        let divOfCategory = $(`<div class="flex-div"><div class='category'>${categoryName}
        <img class="edit-img" src="../../img/icons/n2.png" alt=""></div><button class="minus-btn">-</button></div>`);
        categories.append(divOfCategory);
        divOfCategory.find('.category').click(function () {
            categoryComponent.setCategoryId(categoryId);
            self._categoryId = categoryId;
        });
        this.delCategory(categoryId, divOfCategory, categoryName);

        this.editCategory(divOfCategory, categoryName, categoryId);
    }
    addCategory() {
        let self = this;
        this._uiContainer.find('input').click(() => {
            categoryComponent.setCategoryId(null);
            dishComponent.changeHeader('');
        });
        this._uiContainer.find('.add-btn').click(function () {
            let inputData = self._uiContainer.find('input');
            dataProvider.putCategory(inputData.val()).then(data => {
                self.renderCategory(data.id, data.name)
                inputData.val('');
                myTooltip.tool('', data.name, 'added');
            });
        });
    }

    delCategory(id, divOfData, name) {
        divOfData.find('.minus-btn').click(function () {
            dataProvider.removeCategory(id).then(_ => {
                categoryComponent.setCategoryId(null);
                divOfData.remove();
                myTooltip.tool('', name, 'deleted');
            });
        });
    }
    editCategory(divOfCategory, categoryName, categoryId) {
        let self = this;
        divOfCategory.find('img').click(function () {
            let inputDiv = $(`<div class="flex-div"><input type='text' placeholder='${categoryName}'></div>`);
            let okImg = $(`<img class="ok-img" src="../../img/icons/n2.png" alt="">`);
            divOfCategory.find('.category').replaceWith(inputDiv);
            divOfCategory.find('.minus-btn').replaceWith(okImg);
            self.handleEventCat1(divOfCategory, categoryId, categoryName, inputDiv, okImg);
            categoryComponent.setCategoryId(null);
            dishComponent.changeHeader('');
        });
    }
    async updateCategory(divOfCategory, categoryId, categoryName) {       
        let newValue = divOfCategory.find('input').val();
        try {
            await dataProvider.updateCategory(categoryId, newValue);
            myTooltip.tool(`Category with name: `, categoryName, 'was updated');
            categories.html('');
            this.renderAllCategories();
        }
        catch{            
            categories.html('');
            this.renderAllCategories();            
            myTooltip.error(`Error appeared when `, categoryName, 'was updated');            
        }
    }
    handleEventCat1(divOfCategory, categoryId, categoryName) {
        let self = this;
        divOfCategory.find('input').focus().focusout(function () {
            if (divOfCategory.find('input').val() == '') {
                categories.html('');
                self.renderAllCategories();
                return
            };
            self.updateCategory(divOfCategory, categoryId, categoryName);
        });
        divOfCategory.find('input').keydown(function (e) {
            if (e.which == 13) {
                self.updateCategory(divOfCategory, categoryId, categoryName);
            }
            else if (e.which == 27) {
                categories.html('');
                self.renderAllCategories();
            }
        })
    }
}

export default CategoryListComponent