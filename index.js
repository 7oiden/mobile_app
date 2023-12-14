import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-2f847-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// console.log(app);

const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");

addButton.addEventListener("click", () => {
  let inputValue = inputField.value;

  if (inputValue) {
    push(shoppingListInDB, inputValue);
    clearInputField();
  } else if (!inputValue) {
    inputField.classList.add("button-shake");
    inputField.addEventListener("animationend", () => {
      inputField.classList.remove("button-shake");
    });
  }
});

onValue(shoppingListInDB, (snapshot) => {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    //   console.log(itemsArray);

    clearShoppingList();
    //   console.log(snapshot.val());

    itemsArray.forEach((item) => {
      let currentItem = item;

      // console.log(currentItem)
      addListItem(currentItem);
    });
  } else {
    shoppingList.innerHTML = `<p id="default-msg">There are no items in the shopping list yet...</p>`;
  }
});

//functions
function clearShoppingList() {
  shoppingList.innerHTML = "";
}

function clearInputField() {
  inputField.value = "";
}

function addListItem(item) {
  let itemId = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", () => {
    // console.log(itemId);

    let itemLocationInDB = ref(database, "shoppingList/" + itemId);
    remove(itemLocationInDB);
  });

  shoppingList.appendChild(newEl);
}
