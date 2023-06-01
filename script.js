const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtm = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
  const itemsForStorage = getItemsFromStorage();
  itemsForStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}
function onAddItemSubmit(e) {
  e.preventDefault();
  //Validate input
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("please add an item ");
    return;
  }

  // check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert("that Item Already exits ");
    }
  }

  addItemToDOM(newItem);
  // add item to loca; storage
  addItemToStorage(newItem);
  //add LI to DOM
  checkUI();
  itemInput.value = "";
}

function addItemToDOM(item) {
  // create elements
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}
function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}
function addItemToStorage(item) {
  const itemsForStorage = getItemsFromStorage();

  itemsForStorage.push(item);
  //convert to json string
  localStorage.setItem("items", JSON.stringify(itemsForStorage));
}

function getItemsFromStorage() {
  let itemsForStorage;
  if (localStorage.getItem("items") === null) {
    itemsForStorage = [];
  } else {
    itemsForStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemsForStorage;
}
function onClickItem(e) {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}
function checkIfItemExists(item) {
  const itemsForStorage = getItemsFromStorage();

  return itemsForStorage.includes(item);
}
function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));
  item.classList.add("edit-mode");
  formBtn.innerHTML = '<i class= "fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = "#228B22";
  itemInput.value = item.textContent;
}
function removeItem(item) {
  if (confirm("Are you sure")) {
    item.remove();
    //Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}
function removeItemFromStorage(item) {
  let itemsForStorage = getItemsFromStorage();
  itemsForStorage = itemsForStorage.filter((i) => i !== item);

  //reset to local storage

  localStorage.setItem("items", JSON.stringify(itemsForStorage));
}
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem("items");
  checkUI();
}
function filterItems(e) {
  const text = e.target.value.toLowerCase();
  const item = itemList.querySelectorAll("li");
  item.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      console.log(true);
      item.style.display = "flex";
    } else {
      console.log(false);
      item.style.display = "none";
    }
  });
  console.log(text);
}
function checkUI() {
  const item = itemList.querySelectorAll("li");
  if (item.length === 0) {
    clearBtm.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtm.style.display = "block";
    itemFilter.style.display = "block";
  }

  formBtn.innerHTML = '<i class= "fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
}

// Initialise app
function init() {
  // Event listeners
  itemForm.addEventListener("submit", onAddItemSubmit);
  itemList.addEventListener("click", onClickItem);
  clearBtm.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItems);
  document.addEventListener("DOMContentLoaded", displayItems);
  checkUI();
}
init();
