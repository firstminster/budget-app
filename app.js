// // Storage Controller
// const StorageCtrl = (() => {
//     // Public methods
//     return {
//         storeItem: (item, type) => {
//             let allitems, holdItem;
//             // check if any items in ls
//             if (localStorage.getItem('items') === null) {
//                 allitems = {
//                     inc: [],
//                     exp: []
//                 }
//                 // checks
//                 if (type === 'inc') {
//                     holdItem = item;
//                 } else if (type === 'exp') {
//                     holdItem = item;
//                 }
//                 // push new item
//                 allitems[type].push(holdItem);
//                 // set ls
//                 localStorage.setItem('items', JSON.stringify(allitems));
//             } else {
//                 // Get what is already in ls
//                 allItems = JSON.parse(localStorage.getItem('items'));
//                 // checks
//                 if (type === 'inc') {
//                     holdItem = item;
//                 } else if (type === 'exp') {
//                     holdItem = item;
//                 }
//                 // push new item
//                 allitems[type].push(holdItem);

//                 // Re-set ls
//                 localStorage.setItem('items', JSON.stringify(allitems));
//             }
//         }
//     };
// })();

// Budget Controller
const BudgetCtrl = (() => {
    // Data Structure / State
    const data = {
        allItems: {
            inc: [
                // {
                //     id: 0,
                //     description: 'Salary',
                //     value: 2100
                // },
                // {
                //     id: 1,
                //     description: 'Sold car',
                //     value: 1500
                // }
            ],

            exp: [
                // {
                //     id: 0,
                //     description: 'Apartment rent',
                //     value: 900,
                //     percentage: 21
                // },
                // {
                //     id: 1,
                //     description: 'Grocery shopping',
                //     value: 435,
                //     percentage: 10
                // }
            ]
        },
        totals: {
            inc: 0,
            exp: 0
        },
        currentItem: {
            inc: null,
            exp: null
        },
        budget: 0,
        percentage: -1
    };

    // Income Constructor
    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    // Expense Constructor
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };

        // Calculate Percentage
        calcPercentage(totalIncome) {
            if (totalIncome > 0) {
                this.percentage = Math.round((this.value / totalIncome) * 100);
            } else {
                this.percentage = -1;
            }
        }

        // Get/Return Percentage
        getPercentage() {
            return this.percentage;
        }
    };


    // Calculate Totals
    const calculateTotal = type => {
        let sum = 0;
        data.allItems[type].forEach(cur => {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };


    // Public methods
    return {
        getItems: () => {
            return data.allItems;
        },
        addItem: (type, desc, val) => {
            let ID, newItem;

            // Create ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Values to number
            val = parseInt(val);

            // Create new item based on 'Inc' or 'Exp' type
            if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            } else if (type === 'exp') {
                newItem = new Expense(ID, desc, val);
            }

            // Add to items array / Push into data structure.
            data.allItems[type].push(newItem);

            return newItem;

        },
        getItemById: (id, type) => {
            let found = null;
            // Loop through items
            data.allItems[type].forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;

        },
        updateItem: (type, desc, val) => {
            // value to number
            val = parseInt(val);

            let found = null;

            data.allItems[type].forEach(item => {
                if (item.id === data.currentItem[type].id) {
                    item.description = desc;
                    item.value = val;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: (type, id) => {
            // Get IDs
            const ids = data.allItems[type].map(cur => cur.id);

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            };

        },
        calculateBudget: () => {

            // Calculate total income and expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },
        calculatePercentages: () => {
            data.allItems.exp.forEach(item => item.calcPercentage(data.totals.inc));

        },
        getPercentages: () => {
            let allPerc = data.allItems.exp.map(item => item.getPercentage());
            return allPerc;
        },
        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        updateBudget: () => {

            // Calculate the budget
            BudgetCtrl.calculateBudget();

            // Return the budget
            let budget = BudgetCtrl.getBudget();

            // Display the budget on the UI
            UICtrl.displayBudget(budget);
        },
        updatePercentages: () => {
            // Calculate percentages
            BudgetCtrl.calculatePercentages();

            // Read percentages from the budget controller
            let percentages = BudgetCtrl.getPercentages();

            // Update the UI with the new percentages
            UICtrl.displayPercentages(percentages);

        },
        setCurrentItem: (item, type) => {
            data.currentItem[type] = item;
        },
        getCurrentItem: (type) => {
            return data.currentItem[type];
        },
        clearCurrentItem: () => {
            return {
                incItem: data.currentItem.inc = null,
                expItem: data.currentItem.exp = null,
            };
        },
        logData: () => {
            return data;
        }

    }
})();


// UI Controller
const UICtrl = (() => {
    // Initialize selectors
    const UISelectors = {
        inputType: '.add-type',
        incomeList: '.income-list',
        expenseList: '.expenses-list',
        listIncomes: '.income-list li',
        listExpenses: '.expenses-list li',
        inputBtn: '.add-btn',
        inputDesc: '.add-description',
        inputVal: '.add-value',
        updateBtn: '.update-btn',
        budgetLabel: '.budget-value',
        incomeLabel: '.income-value',
        expensesLabel: '.expenses-value',
        percLabel: '.expenses-percentage',
        dateLabel: '.budget-month',
        itemList: '.flex-layout',
        expPercLabel: '.exp-percent',
        alertLabel: '.alert-parent'
    };

    // Format Numbers
    const formatNumber = (val, type) => {
        /*  
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
        */

        let valSplit,
            num,
            dec;

        val = Math.abs(val);
        valSplit = val.toFixed(2).split('.');

        num = valSplit[0];

        // Check if the value is above 3 digits
        if (num.length > 3) {
            num = num.substr(0, num.length - 3) + ',' + num.substr(num.length - 3, 3);
        }

        dec = valSplit[1];

        // Ternary condition to display the sign symbol
        return (type === 'exp' ? '-' : '+') + ' ' + num + '.' + dec;

    };


    // Public methods
    return {
        getInput: () => {
            return {
                type: document.querySelector(UISelectors.inputType).value, // Will be either inc or exp
                description: document.querySelector(UISelectors.inputDesc).value,
                value: document.querySelector(UISelectors.inputVal).value
            };
        },
        addListItem: (item, type) => {
            let element;

            if (type === 'inc') {
                element = UISelectors.incomeList;

                // Create li element
                const li = document.createElement('li');
                // Add class
                li.className = 'item';
                // Add ID
                li.id = `inc-${item.id}`;
                // Add HTML
                li.innerHTML = `<strong>${item.description}</strong>
                <span class="inc-value">${formatNumber(item.value, type)}</span>
                <a href="#" class="btn">
                    <i class="edit-btn fas fa-pencil-alt"></i>
                </a>
                <a href="#" class="btn">
                    <i class="delete-btn far fa-trash-alt"></i>
                </a>`;
                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentElement('beforeend', li);

            } else if (type === 'exp') {
                element = UISelectors.expenseList;

                // Create li element
                const li = document.createElement('li');
                // Add class
                li.className = 'item';
                // Add ID
                li.id = `exp-${item.id}`;
                // Add HTML
                li.innerHTML = `<strong>${item.description}</strong>
                <span class="exp-value">${formatNumber(item.value, type)}</span>
                <em class="exp-percent">${item.percentage}</em>
                <a href="#" class="btn">
                    <i class="edit-btn fas fa-pencil-alt"></i>
                </a>
                <a href="#" class="btn">
                    <i class="delete-btn far fa-trash-alt"></i>
                </a>`;
                // Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentElement('beforeend', li);
            }

        },
        updateListItem: (item, type) => {

            if (type === 'inc') {
                let listIncomes = document.querySelectorAll(UISelectors.listIncomes);

                // Turn Node list into array
                listIncomes = Array.from(listIncomes);

                listIncomes.forEach((listIncome) => {
                    const incID = listIncome.getAttribute('id');

                    if (incID === `${type}-${item.id}`) {
                        document.querySelector(`#${incID}`).innerHTML = `<strong>${item.description}</strong>
                        <span class="inc-value">${formatNumber(item.value, type)}</span>
                        <a href="#" class="btn">
                            <i class="edit-btn fas fa-pencil-alt"></i>
                        </a>
                        <a href="#" class="btn">
                            <i class="delete-btn far fa-trash-alt"></i>
                        </a>`;
                    }
                });

            } else if (type === 'exp') {
                let listExpenses = document.querySelectorAll(UISelectors.listExpenses);

                // Turn Node list into array
                listExpenses = Array.from(listExpenses);

                listExpenses.forEach((listExp) => {
                    const expID = listExp.getAttribute('id');

                    if (expID === `${type}-${item.id}`) {
                        document.querySelector(`#${expID}`).innerHTML = `<strong>${item.description}</strong>
                        <span class="exp-value">${formatNumber(item.value, type)}</span>
                        <em class="exp-percent">${item.percentage}</em>
                        <a href="#" class="btn">
                            <i class="edit-btn fas fa-pencil-alt"></i>
                        </a>
                        <a href="#" class="btn">
                            <i class="delete-btn far fa-trash-alt"></i>
                        </a>`;
                    }
                });
            }


        },
        deleteListItem: (type, id) => {
            const itemID = `#${type}-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        displayBudget: (item) => {
            let type;
            item.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(UISelectors.budgetLabel).textContent = formatNumber(item.budget, type);
            document.querySelector(UISelectors.incomeLabel).textContent = formatNumber(item.totalInc, 'inc');
            document.querySelector(UISelectors.expensesLabel).textContent = formatNumber(item.totalExp, 'exp');

            if (item.percentage > 0) {
                document.querySelector(UISelectors.percLabel).textContent = item.percentage + '%';
            } else {
                document.querySelector(UISelectors.percLabel).textContent = '----';
            }
        },
        displayPercentages: (percentages) => {
            let fields = document.querySelectorAll(UISelectors.expPercLabel);

            fields.forEach((item, index) => {
                if (percentages[index] > 0) {
                    item.textContent = percentages[index] + '%';
                } else {
                    item.textContent = '----';
                }
            });
        },
        addItemToForm: (type) => {
            document.querySelector(UISelectors.inputType).value = type, // Will be either inc or exp
                document.querySelector(UISelectors.inputDesc).value = BudgetCtrl.getCurrentItem(type).description,
                document.querySelector(UISelectors.inputVal).value = BudgetCtrl.getCurrentItem(type).value;

            // Show update state
            UICtrl.showUpdateState()
        },
        showAlert: (message, className) => {
            UICtrl.clearAlerts();

            // create div
            const div = document.createElement('div');
            // Add classes 
            div.className = `alert ${className}`;
            // Add text
            div.appendChild(document.createTextNode(message));
            // Get parent
            const container = document.querySelector(UISelectors.alertLabel);
            // Get Item list
            const itemList = document.querySelector(UISelectors.itemList);
            // Insert alert div
            container.insertBefore(div, itemList);

            // Timeout after 3 sec
            setTimeout(() => {
                UICtrl.clearAlerts();
            }, 3000);
        },
        clearAlerts: () => {
            const currentAlerts = document.querySelector('.alert');

            if (currentAlerts) {
                currentAlerts.remove();
            }
        },
        displayMonth: () => {
            let now, daysArr, monthsArr, day, month, year;

            now = new Date();

            monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ];
            daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            month = now.getMonth();
            day = now.getDay();
            year = now.getFullYear();

            document.querySelector(UISelectors.dateLabel).textContent = daysArr[day] + ' ' + monthsArr[month] + ' ' + year;
        },
        changedType: () => {
            let fields = document.querySelectorAll(UISelectors.inputType + ',' +
                UISelectors.inputDesc + ',' + UISelectors.inputVal);

            fields.forEach(item => {
                item.classList.toggle('red-focus');
            });

            document.querySelector(UISelectors.inputBtn).classList.toggle('red');
        },
        clearUpdateState: () => {
            // Clear input fields
            UICtrl.clearInput();

            document.querySelector(UISelectors.inputBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
        },
        showUpdateState: () => {
            document.querySelector(UISelectors.inputBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        },
        clearInput: () => {
            type = 'inc';

            document.querySelector(UISelectors.inputType).value = type,
            document.querySelector(UISelectors.inputDesc).value = '',
            document.querySelector(UISelectors.inputVal).value = ''

            // Clear current Items
            BudgetCtrl.clearCurrentItem().incItem;
            BudgetCtrl.clearCurrentItem().expItem
        },
        getSelectors: () => {
            return UISelectors;
        }
    }
})();


// App Controller
const App = ((BudgetCtrl, UICtrl) => {

    // Load event listeners
    const loadEventListeners = function () {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors()

        // Add Item submit event
        document.querySelector(UISelectors.inputBtn).addEventListener('click', addItemSubmit);

        // De-activate the Enter key
        document.addEventListener('keypress', event => {
            if (event.keyCode === 13 || event.which === 13) {
                // addItemSubmit(event);
                return false;
            }
        });

         // Delete specific item click event
        document.querySelector(UISelectors.itemList).addEventListener('click', deleteItem);

         // Edit specific item click event
        document.querySelector(UISelectors.itemList).addEventListener('click', editItemClick)

        // Update Item submit event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItemSubmit)

        // Change Input fields style
        // document.querySelector(UISelectors.inputType).addEventListener('change', UICtrl.changedType);
    };


    // Add Item submit
    const addItemSubmit = (e) => {

        // Get form input from UI controller
        const input = UICtrl.getInput();

        // Check for description and value
        if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {

            // Add the item to the budget controller
            newItem = BudgetCtrl.addItem(input.type, input.description, input.value);

            console.log(newItem);
            // Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // Calculate and update the budget
            BudgetCtrl.updateBudget();

            // calculate and update percentages
            BudgetCtrl.updatePercentages();

            // Show Alert
            UICtrl.showAlert('Budget Successfully Added..', 'success');

            // Clear input fields
            UICtrl.clearInput();
        } else {
            // Show Alert
            UICtrl.showAlert('Please fill in all fields.', 'error');
        }

        e.preventDefault();
    };

    // Edit item event handler
    const editItemClick = (e) => {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors()

        // Check if the class has 'edit-btn'
        if (e.target.classList.contains('edit-btn')) {

            // Get list item id (inc-0, inc-1 / exp-0, exp-1)
            const listId = e.target.parentNode.parentNode.id

            // Break into an array
            const listIdArr = listId.split('-');
            // Get the actual type
            const type = listIdArr[0];
            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToDelete = BudgetCtrl.getItemById(id, type);

            // Set current item
            BudgetCtrl.setCurrentItem(itemToDelete, type);

            // Add item to form
            UICtrl.addItemToForm(type);

            // Disable Select Options
            document.querySelector(UISelectors.inputType).setAttribute('disabled', true);
        }
        e.preventDefault();
    };

    // Update item event handler
    const updateItemSubmit = (e) => {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors()

        // Get form input from UI controller
        const input = UICtrl.getInput();

        // Check for description and value
        if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {

            // update Item
            const updatedItem = BudgetCtrl.updateItem(input.type, input.description, input.value);

            console.log(updatedItem);
            // update UI
            UICtrl.updateListItem(updatedItem, input.type);

            // Calculate and update the budget
            BudgetCtrl.updateBudget();

            // calculate and update percentages
            BudgetCtrl.updatePercentages();

            // Enable Select Options
            document.querySelector(UISelectors.inputType).disabled = false;

            // Show Alert
            UICtrl.showAlert('Updated Budget Successfully...', 'update');

            // Clear update state / set initial State
            UICtrl.clearUpdateState();
        } else {
            // Show Alert
            UICtrl.showAlert('Please fill in all fields.', 'error');
        }

        e.preventDefault();
    };

    // Delete item event handler
    const deleteItem = (e) => {

        if (e.target.classList.contains('delete-btn')) {
            // Get list item id (inc-0, inc-1 / exp-0, exp-1)
            const listId = e.target.parentNode.parentNode.id

            console.log(listId);
            // Break into an array
            const listIdArr = listId.split('-');
            // Get the actual type
            const type = listIdArr[0];
            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Delete the item from the data structure
            BudgetCtrl.deleteItem(type, id);

            // Delete the item from the UI
            UICtrl.deleteListItem(type, id);

            // Update and show the new budget
            BudgetCtrl.updateBudget();

            // calculate and update percentages
            BudgetCtrl.updatePercentages();

            // Clear update state / set initial State
            UICtrl.clearUpdateState();

            // Show Alert
            UICtrl.showAlert('Deleted Budget Successfully...', 'success');
        }
        e.preventDefault();
    };




    // Public methods
    return {

        init: () => {
            console.log('Application has started.');
            console.log(BudgetCtrl.logData());

            // Display the date on the UI
            UICtrl.displayMonth();

            // Clear update state / set initial State
            UICtrl.clearUpdateState();

            // Display the default budget values on the UI
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
            });

            // Load event listeners
            loadEventListeners();
        }
    }

})(BudgetCtrl, UICtrl);


// Initialize App
App.init();