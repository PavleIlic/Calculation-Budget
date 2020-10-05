// Budget Controller
var budgetController = (function(){
    
    var Expense = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });
        data.total[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        total: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: function(type,des,val){
            var newItem, ID;

            // Add 1 for last ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } else{
                ID = 0;
            }

            // Create item 'exp' or 'inc'
            if(type === 'exp'){
                newItem = new Expense(ID, des, val)
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val)
            }
            
            // Push new item to an array
            data.allItems[type].push(newItem);

            // Return new item
            return newItem;
        },

        calculateBudget: function () {
            
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate a budget: inc - expenses
            data.budget = data.total.inc - data.total.exp;

            // calculate the percentage of income that we spent
            if(data.total.inc > 0){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function (){
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    }

})();

// UI controller
var UIController = (function(){

    // Some code

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    }

    return {
        getInput: function () {
            return {                
                    type: document.querySelector(DOMstrings.inputType).value,
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
            }
        },

        addListItem: function (obj, type) {
            
            var html, newHtml, element;

            // create HTML code with placeholder text

            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-$id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace a placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert HTML to some DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            })

            fieldsArray[0].focus();
        },

        displayBudget: function (obj) {
          
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'
            }
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();


// Global app Controller
var controller = (function(budgetCtrl, UICtrl){
    // Some code

    var setupEventListeners = function (){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function () {
        // 1. Calculate the budge
        budgetCtrl.calculateBudget();

        // 2. Return budget
        var budget = budgetCtrl.getBudget();

        // 3. Display budget on the UI
        UICtrl.displayBudget(budget);
    }

    var ctrlAddItem = function () {
        
            var input, newItem;
            // 1. Get the input value
            input = UICtrl.getInput();

            if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add item to UI
            UICtrl.addListItem(newItem, input.type);
    
            // 4. Clear the fields
            UICtrl.clearFields();
    
            // 5. Calculate and update budget
            updateBudget();
        }
    };

    return {
        init: function (){
            console.log('Application has started!'),
            UICtrl.displayBudget({
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1               
            });
            setupEventListeners();
        }
    }
    
    
})(budgetController, UIController);

controller.init();