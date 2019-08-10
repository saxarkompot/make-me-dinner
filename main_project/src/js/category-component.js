import myTooltip from "./my-tooltip.js";
import DataProvider from "./data-provider.js";
const dataProvider = DataProvider.getInstanse();
const dishesContainer = $('.div-of-dishes');
const divImp = $(`<input type="file" name="image" />`);
$('.new-image').on('error', function () {
    $('.new-image').attr('src', "/img/icons/no-image.png");
});

class CategoryComponent {
    constructor(uiContainer, dishComponent) {
        this._dishComponent = dishComponent;
        this._uiContainer = uiContainer;
        this._categoryId = null;
        this._initPhotoBtn();
        this._initFileUpload();
        this.setCategoryId(this._categoryId);
        this._addDish();
    }
    setCategoryId(selectedCategoryId) {
        this._categoryId = selectedCategoryId;
        this._clear();
        if (this._categoryId) {
            this._renderAllDishes();
            $('.new-image').show();
            $('.photo-image').show();
            let newImage = `http://localhost:3001${dataProvider.arrayOfCategories.find((e) => e.id == this._categoryId).imageUrl}`;
            $('.new-image').attr("src", newImage);
            this._changeHeader(dataProvider.getCategoryById(this._categoryId).name);
        } else {
            $('.new-image').hide();
            $('.photo-image').hide();
            this._changeHeader('');
        }        
    }
    _clear() {
        dishesContainer.html('');
        this._dishComponent.clear();
    }
    _changeHeader(categoryData) {
        let separator = this._uiContainer.find('.separator');
        let namOfRow = this._uiContainer.find('.name-dish-header');
        namOfRow.html(`${categoryData}`);
        if (namOfRow.html() == '') {
            separator.html("");
        } else {
            separator.html(":");
        }
        this._uiContainer.find('input').val('');
    }
    _renderDish(dish) {
        let self = this;
        let divOfDish = $(`<div class="flex-div"><div class='category'>${dish.name}
        <img class="edit-img" src="../../img/icons/n2.png" alt=""></div><button class="minus-btn">-</button></div>`);
        dishesContainer.append(divOfDish);
        divOfDish.find('.category').click(function () {
            self._dishComponent.changeHeader(dish.name);
            self._dishComponent.setSettings(dish);
        });
        this._delDish(dish.id, divOfDish, dish.name);
    }
    _renderAllDishes() {
        let category = dataProvider.getCategoryById(this._categoryId);
        for (let dish of category.dishes) {
            this._renderDish(dish);
        };
    }
    _addDish() {
        let self = this;
        this._uiContainer.find('.add-btn').click(function () {
            let inputData = self._uiContainer.find('input');
            if (inputData.val() == "") return;
            if (!self._categoryId) return;
            dataProvider.putDish(inputData.val(), self._categoryId).then(data => {
                self._renderDish(data);
                inputData.val('');
                myTooltip.tool('', data.name, 'added');
            });
        });
    }
    _delDish(dishId, divOfData, name) {
        let self = this;
        divOfData.find('.minus-btn').click(function () {
            dataProvider.removeDish(self._categoryId, dishId).then(_ => {
                divOfData.remove();
                myTooltip.tool('', name, 'deleted');
            });
        });
    }
    _initPhotoBtn() {
        let photoImage = $('.photo-image');
        photoImage.click(function () {
            divImp.click();
        });
    }
    _initFileUpload() {
        let self = this;
        divImp.change(function () {
            var formData = new FormData();
            formData.append('image', this.files[0]);
            dataProvider.updateImage(self._categoryId, formData).then(data => {
                myTooltip.tool(`In category with name: `, dataProvider.arrayOfCategories.find(e => e.id == self._categoryId).name, 'was add image');
                let newImage = `http://localhost:3001${data.imageUrl}`;
                $('.new-image').attr('src', newImage);
            });
        });

    }

}

export default CategoryComponent