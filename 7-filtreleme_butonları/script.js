const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll(".filter-buttons button");

document.addEventListener("DOMContentLoaded", function () {
  loadItems();
  shoppingForm.addEventListener("submit", handleFormSubmit);

  for (let button of filterButtons) {
    button.addEventListener("click", handleFilterSelection);
  }
});

function loadItems() {
  const items = [
    { id: 1, name: "yumurta", completed: false },
    { id: 2, name: "Balık", completed: true },
    { id: 3, name: "Süt", completed: false },
    { id: 4, name: "Zeytin", completed: false },
  ];

  shoppingList.innerHTML = "";

  for (let item of items) {
    const li = createListItem(item);
    shoppingList.appendChild(li);
  }
}

function addItem(input) {
  const newItem = createListItem({
    id: generateId(),
    name: input.value,
    completed: false,
  });

  shoppingList.appendChild(newItem);

  input.value = "";
}

function generateId() {
  return Date.now().toString();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const input = document.getElementById("item_name");

  if (input.value.trim().length === 0) {
    alert("Yeni değer giriniz");
    return;
  }

  addItem(input);
}

function createListItem(item) {
  // checkbox
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = item.completed;
  input.classList.add("form-check-input");
  input.addEventListener("change", toogleCompleted);

  //item
  const div = document.createElement("div");
  div.className = "item_name";
  div.textContent = item.name;
  div.addEventListener("click", openEditMode);
  div.addEventListener("blur", closeEditMode);
  div.addEventListener("keydown", cancelEnter);

  //delete icon
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fs-3 bi bi-x text-danger delete-icon";
  deleteIcon.addEventListener("click", removeItem);

  //li
  const li = document.createElement("li");
  li.className = "border rounded p-2 mb-1";
  li.toggleAttribute("item-completed", item.completed);

  li.appendChild(input);
  li.appendChild(div);
  li.appendChild(deleteIcon);

  return li;
}

function toogleCompleted(e) {
  const li = e.target.parentElement;
  li.toggleAttribute("item-completed", e.target.checked);
}
function removeItem(e) {
  const li = e.target.parentElement;
  shoppingList.removeChild(li);
}
function openEditMode(e) {
  const li = e.target.parentElement;

  if (li.hasAttribute("item-completed") == false) {
    e.target.contentEditable = true;
  }
}
function closeEditMode(e) {
  e.target.contentEditable = false;
}
function cancelEnter(e) {
  if (e.key == "Enter") {
    e.preventDefault();
    closeEditMode(e);
  }
}

function handleFilterSelection(e) {
  const filterBtn = e.target;

  for (let button of filterButtons) {
    button.classList.add("btn-secondary");
    button.classList.remove("btn-primary");
  }

  filterBtn.classList.add("btn-primary");
  filterBtn.classList.remove("btn-secondary");
}
