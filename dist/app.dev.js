"use strict";

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Storage Controller
var StorageCtrl = function () {
  // Public methods
  return {};
}(); // Budget Controller


var BudgetCtrl = function () {
  // Data Structure / State
  var data = {
    allItems: {
      inc: [// {
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
      exp: [// {
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
  }; // Income Constructor

  var Income = function Income(id, description, value) {
    _classCallCheck(this, Income);

    this.id = id;
    this.description = description;
    this.value = value;
  }; // Expense Constructor


  var Expense =
  /*#__PURE__*/
  function () {
    function Expense(id, description, value) {
      _classCallCheck(this, Expense);

      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
    }

    _createClass(Expense, [{
      key: "calcPercentage",
      // Calculate Percentage
      value: function calcPercentage(totalIncome) {
        if (totalIncome > 0) {
          this.percentage = Math.round(this.value / totalIncome * 100);
        } else {
          this.percentage = -1;
        }
      } // Get/Return Percentage

    }, {
      key: "getPercentage",
      value: function getPercentage() {
        return this.percentage;
      }
    }]);

    return Expense;
  }();

  ; // Calculate Totals

  var calculateTotal = function calculateTotal(type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  }; // Public methods


  return {
    getItems: function getItems() {
      return data.allItems;
    },
    addItem: function addItem(type, desc, val) {
      var ID, newItem; // Create ID

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      } // Values to number


      val = parseInt(val); // Create new item based on 'Inc' or 'Exp' type

      if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      } else if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } // Add to items array / Push into data structure.


      data.allItems[type].push(newItem);
      return newItem;
    },
    getItemById: function getItemById(id, type) {
      var found = null; // Loop through items

      data.allItems[type].forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function updateItem(type, desc, val) {
      // value to number
      val = parseInt(val);
      var found = null;
      data.allItems[type].forEach(function (item) {
        if (item.id === data.currentItem[type].id) {
          item.description = desc;
          item.value = val;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function deleteItem(type, id) {
      // Get IDs
      var ids = data.allItems[type].map(function (cur) {
        return cur.id;
      }); // Get index

      var index = ids.indexOf(id); // Remove item

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

      ;
    },
    calculateBudget: function calculateBudget() {
      // Calculate total income and expenses
      calculateTotal('inc');
      calculateTotal('exp'); // Calculate the budget: income - expenses

      data.budget = data.totals.inc - data.totals.exp; // calculate the percentage of income that we spent

      if (data.totals.inc > 0) {
        data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function calculatePercentages() {
      data.allItems.exp.forEach(function (item) {
        return item.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function getPercentages() {
      var allPerc = data.allItems.exp.map(function (item) {
        return item.getPercentage();
      });
      return allPerc;
    },
    getBudget: function getBudget() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    updateBudget: function updateBudget() {
      // Calculate the budget
      BudgetCtrl.calculateBudget(); // Return the budget

      var budget = BudgetCtrl.getBudget(); // Display the budget on the UI

      UICtrl.displayBudget(budget);
    },
    updatePercentages: function updatePercentages() {
      // Calculate percentages
      BudgetCtrl.calculatePercentages(); // Read percentages from the budget controller

      var percentages = BudgetCtrl.getPercentages(); // Update the UI with the new percentages

      UICtrl.displayPercentages(percentages);
    },
    setCurrentItem: function setCurrentItem(item, type) {
      data.currentItem[type] = item;
    },
    getCurrentItem: function getCurrentItem(type) {
      return data.currentItem[type];
    },
    clearCurrentItem: function clearCurrentItem() {
      return {
        incItem: data.currentItem.inc = null,
        expItem: data.currentItem.exp = null
      };
    },
    logData: function logData() {
      return data;
    }
  };
}(); // UI Controller


var UICtrl = function () {
  // Initialize selectors
  var UISelectors = {
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
  }; // Format Numbers

  var formatNumber = function formatNumber(val, type) {
    /*  
        + or - before number
        exactly 2 decimal points
        comma separating the thousands
         2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
    */
    var valSplit, num, dec;
    val = Math.abs(val);
    val = val.toFixed(2); // Split the input values with decimal points

    valSplit = val.split('.');
    num = valSplit[0]; // Check if the value is above 3 digits

    if (num.length > 3) {
      num = num.substr(0, num.length - 3) + ',' + num.substr(num.length - 3, 3);
    }

    dec = valSplit[1]; // Ternary condition to display the sign symbol

    return (type === 'exp' ? '-' : '+') + ' ' + num + '.' + dec;
  }; // Public methods


  return {
    getInput: function getInput() {
      return {
        type: document.querySelector(UISelectors.inputType).value,
        // Will be either inc or exp
        description: document.querySelector(UISelectors.inputDesc).value,
        value: document.querySelector(UISelectors.inputVal).value
      };
    },
    addListItem: function addListItem(item, type) {
      var element;

      if (type === 'inc') {
        element = UISelectors.incomeList; // Create li element

        var li = document.createElement('li'); // Add class

        li.className = 'item'; // Add ID

        li.id = "inc-".concat(item.id); // Add HTML

        li.innerHTML = "<strong>".concat(item.description, "</strong>\n                <span class=\"inc-value\">").concat(formatNumber(item.value, type), "</span>\n                <a href=\"#\" class=\"btn\">\n                    <i class=\"edit-btn fas fa-pencil-alt\"></i>\n                </a>\n                <a href=\"#\" class=\"btn\">\n                    <i class=\"delete-btn far fa-trash-alt\"></i>\n                </a>"); // Insert the HTML into the DOM

        document.querySelector(element).insertAdjacentElement('beforeend', li);
      } else if (type === 'exp') {
        element = UISelectors.expenseList; // Create li element

        var _li = document.createElement('li'); // Add class


        _li.className = 'item'; // Add ID

        _li.id = "exp-".concat(item.id); // Add HTML

        _li.innerHTML = "<strong>".concat(item.description, "</strong>\n                <span class=\"exp-value\">").concat(formatNumber(item.value, type), "</span>\n                <em class=\"exp-percent\">").concat(item.percentage, "</em>\n                <a href=\"#\" class=\"btn\">\n                    <i class=\"edit-btn fas fa-pencil-alt\"></i>\n                </a>\n                <a href=\"#\" class=\"btn\">\n                    <i class=\"delete-btn far fa-trash-alt\"></i>\n                </a>"); // Insert the HTML into the DOM

        document.querySelector(element).insertAdjacentElement('beforeend', _li);
      }
    },
    updateListItem: function updateListItem(item, type) {
      if (type === 'inc') {
        var listIncomes = document.querySelectorAll(UISelectors.listIncomes); // Turn Node list into array

        listIncomes = Array.from(listIncomes);
        listIncomes.forEach(function (listIncome) {
          var incID = listIncome.getAttribute('id');

          if (incID === "".concat(type, "-").concat(item.id)) {
            document.querySelector("#".concat(incID)).innerHTML = "<strong>".concat(item.description, "</strong>\n                        <span class=\"inc-value\">").concat(formatNumber(item.value, type), "</span>\n                        <a href=\"#\" class=\"btn\">\n                            <i class=\"edit-btn fas fa-pencil-alt\"></i>\n                        </a>\n                        <a href=\"#\" class=\"btn\">\n                            <i class=\"delete-btn far fa-trash-alt\"></i>\n                        </a>");
          }
        });
      } else if (type === 'exp') {
        var listExpenses = document.querySelectorAll(UISelectors.listExpenses); // Turn Node list into array

        listExpenses = Array.from(listExpenses);
        listExpenses.forEach(function (listExp) {
          var expID = listExp.getAttribute('id');

          if (expID === "".concat(type, "-").concat(item.id)) {
            document.querySelector("#".concat(expID)).innerHTML = "<strong>".concat(item.description, "</strong>\n                        <span class=\"exp-value\">").concat(formatNumber(item.value, type), "</span>\n                        <em class=\"exp-percent\">").concat(item.percentage, "</em>\n                        <a href=\"#\" class=\"btn\">\n                            <i class=\"edit-btn fas fa-pencil-alt\"></i>\n                        </a>\n                        <a href=\"#\" class=\"btn\">\n                            <i class=\"delete-btn far fa-trash-alt\"></i>\n                        </a>");
          }
        });
      }
    },
    deleteListItem: function deleteListItem(type, id) {
      var itemID = "#".concat(type, "-").concat(id);
      var item = document.querySelector(itemID);
      item.remove();
    },
    displayBudget: function displayBudget(item) {
      var type;
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
    displayPercentages: function displayPercentages(percentages) {
      var fields = document.querySelectorAll(UISelectors.expPercLabel);
      fields.forEach(function (item, index) {
        if (percentages[index] > 0) {
          item.textContent = percentages[index] + '%';
        } else {
          item.textContent = '----';
        }
      });
    },
    addItemToForm: function addItemToForm(type) {
      document.querySelector(UISelectors.inputType).value = type, // Will be either inc or exp
      document.querySelector(UISelectors.inputDesc).value = BudgetCtrl.getCurrentItem(type).description, document.querySelector(UISelectors.inputVal).value = BudgetCtrl.getCurrentItem(type).value; // Show update state

      UICtrl.showUpdateState();
    },
    showAlert: function showAlert(message, className) {
      UICtrl.clearAlerts(); // create div

      var div = document.createElement('div'); // Add classes 

      div.className = "alert ".concat(className); // Add text

      div.appendChild(document.createTextNode(message)); // Get parent

      var container = document.querySelector(UISelectors.alertLabel); // Get Item list

      var itemList = document.querySelector(UISelectors.itemList); // Insert alert div

      container.insertBefore(div, itemList); // Timeout after 3 sec

      setTimeout(function () {
        UICtrl.clearAlerts();
      }, 3000);
    },
    clearAlerts: function clearAlerts() {
      var currentAlerts = document.querySelector('.alert');

      if (currentAlerts) {
        currentAlerts.remove();
      }
    },
    displayMonth: function displayMonth() {
      var now, daysArr, monthsArr, day, month, year;
      now = new Date();
      monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      month = now.getMonth();
      day = now.getDay();
      year = now.getFullYear();
      document.querySelector(UISelectors.dateLabel).textContent = daysArr[day] + ' ' + monthsArr[month] + ' ' + year;
    },
    changedType: function changedType() {
      var fields = document.querySelectorAll(UISelectors.inputType + ',' + UISelectors.inputDesc + ',' + UISelectors.inputVal);
      fields.forEach(function (item) {
        item.classList.toggle('red-focus');
      });
      document.querySelector(UISelectors.inputBtn).classList.toggle('red');
    },
    clearUpdateState: function clearUpdateState() {
      // Clear input fields
      UICtrl.clearInput();
      document.querySelector(UISelectors.inputBtn).style.display = 'inline';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
    },
    showUpdateState: function showUpdateState() {
      document.querySelector(UISelectors.inputBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
    },
    clearInput: function clearInput() {
      type = 'inc';
      document.querySelector(UISelectors.inputType).value = type, document.querySelector(UISelectors.inputDesc).value = '', document.querySelector(UISelectors.inputVal).value = ''; // Clear current Items

      BudgetCtrl.clearCurrentItem().incItem;
      BudgetCtrl.clearCurrentItem().expItem;
    },
    getSelectors: function getSelectors() {
      return UISelectors;
    }
  };
}(); // App Controller


var App = function (BudgetCtrl, UICtrl) {
  // Load event listeners
  var loadEventListeners = function loadEventListeners() {
    // Get UI selectors
    var UISelectors = UICtrl.getSelectors(); // Add Item submit event

    document.querySelector(UISelectors.inputBtn).addEventListener('click', addItemSubmit);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        // addItemSubmit(event);
        return false;
      }
    }); // Delete icon click event

    document.querySelector(UISelectors.itemList).addEventListener('click', deleteItem); // Edit icon click event

    document.querySelector(UISelectors.itemList).addEventListener('click', editItemClick); // Update Item submit event

    document.querySelector(UISelectors.updateBtn).addEventListener('click', updateItemSubmit); // Change Input fields style
    // document.querySelector(UISelectors.inputType).addEventListener('change', UICtrl.changedType);
  }; // Add Item submit


  var addItemSubmit = function addItemSubmit(e) {
    // Get form input from UI controller
    var input = UICtrl.getInput(); // Check for description and value

    if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {
      // Add the item to the budget controller
      newItem = BudgetCtrl.addItem(input.type, input.description, input.value); // Add the item to the UI

      UICtrl.addListItem(newItem, input.type); // Calculate and update the budget

      BudgetCtrl.updateBudget(); // calculate and update percentages

      BudgetCtrl.updatePercentages(); // Show Alert

      UICtrl.showAlert('Budget Successfully Added..', 'success'); // Clear input fields

      UICtrl.clearInput();
    } else {
      // Show Alert
      UICtrl.showAlert('Please fill in all fields.', 'error');
    }

    e.preventDefault();
  }; // Edit item event handler


  var editItemClick = function editItemClick(e) {
    // Get UI selectors
    var UISelectors = UICtrl.getSelectors(); // Check if the class has 'edit-btn'

    if (e.target.classList.contains('edit-btn')) {
      // Get list item id (inc-0, inc-1 / exp-0, exp-1)
      var listId = e.target.parentNode.parentNode.id; // Break into an array

      var listIdArr = listId.split('-'); // Get the actual type

      var _type = listIdArr[0]; // Get the actual id

      var id = parseInt(listIdArr[1]); // Get item

      var itemToDelete = BudgetCtrl.getItemById(id, _type); // Set current item

      BudgetCtrl.setCurrentItem(itemToDelete, _type); // Add item to form

      UICtrl.addItemToForm(_type); // Disable Select Options

      document.querySelector(UISelectors.inputType).setAttribute('disabled', true);
    }

    e.preventDefault();
  }; // Update item event handler


  var updateItemSubmit = function updateItemSubmit(e) {
    // Get UI selectors
    var UISelectors = UICtrl.getSelectors(); // Get form input from UI controller

    var input = UICtrl.getInput(); // Check for description and value

    if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {
      // update Item
      var updatedItem = BudgetCtrl.updateItem(input.type, input.description, input.value);
      console.log(updatedItem); // update UI

      UICtrl.updateListItem(updatedItem, input.type); // Calculate and update the budget

      BudgetCtrl.updateBudget(); // calculate and update percentages

      BudgetCtrl.updatePercentages(); // Enable Select Options

      document.querySelector(UISelectors.inputType).disabled = false; // Show Alert

      UICtrl.showAlert('Updated Budget Successfully...', 'update'); // Clear update state / set initial State

      UICtrl.clearUpdateState();
    } else {
      // Show Alert
      UICtrl.showAlert('Please fill in all fields.', 'error');
    }

    e.preventDefault();
  }; // Delete item event handler


  var deleteItem = function deleteItem(e) {
    if (e.target.classList.contains('delete-btn')) {
      // Get list item id (inc-0, inc-1 / exp-0, exp-1)
      var listId = e.target.parentNode.parentNode.id; // Break into an array

      var listIdArr = listId.split('-'); // Get the actual type

      var _type2 = listIdArr[0]; // Get the actual id

      var id = parseInt(listIdArr[1]); // Delete the item from the data structure

      BudgetCtrl.deleteItem(_type2, id); // Delete the item from the UI

      UICtrl.deleteListItem(_type2, id); // Update and show the new budget

      BudgetCtrl.updateBudget(); // calculate and update percentages

      BudgetCtrl.updatePercentages(); // Clear update state / set initial State

      UICtrl.clearUpdateState(); // Show Alert

      UICtrl.showAlert('Deleted Budget Successfully...', 'success');
    }

    e.preventDefault();
  }; // Public methods


  return {
    init: function init() {
      console.log('Application has started.');
      console.log(BudgetCtrl.logData()); // Display the date on the UI

      UICtrl.displayMonth(); // Clear update state / set initial State

      UICtrl.clearUpdateState(); // Display the default budget values on the UI

      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      }); // Load event listeners

      loadEventListeners();
    }
  };
}(BudgetCtrl, UICtrl); // Initialize App


App.init();