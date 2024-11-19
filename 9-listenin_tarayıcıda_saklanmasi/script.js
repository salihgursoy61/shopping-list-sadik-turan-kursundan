const shoppingList = document.querySelector(".shopping-list");
const shoppingForm = document.querySelector(".shopping-form");
const filterButtons = document.querySelectorAll(".filter-buttons button");
const clearBtn = document.querySelector(".clear");

document.addEventListener("DOMContentLoaded", function () {
  loadItems();
  updateState();
  shoppingForm.addEventListener("submit", handleFormSubmit);

  for (let button of filterButtons) {
    button.addEventListener("click", handleFilterSelection);
  }

  clearBtn.addEventListener("click", clear);
});

function updateState() {
  const isEmpty = shoppingList.querySelectorAll("li").length === 0;

  const alert = document.querySelector(".alert ");
  const filterBtns = document.querySelector(".filter-buttons");

  alert.classList.toggle("d-none", !isEmpty);
  clearBtn.classList.toggle("d-none", isEmpty);
  filterBtns.classList.toggle("d-none", isEmpty);
}

function clear() {
  shoppingList.innerHTML = "";
  localStorage.clear("shoppingItems");
  updateState();
}

function saveToLS() {
  const listItems = shoppingList.querySelectorAll("li");
  const liste = [];

  for (let li of listItems) {
    const id = li.getAttribute("item-id");
    const name = li.querySelector(".item-name").textContent;
    const completed = li.hasAttribute("item-completed");

    liste.push({ id, name, completed });
  }

  localStorage.setItem("shoppingItems", JSON.stringify(liste));
}

function loadItems() {
  const items = JSON.parse(localStorage.getItem("shoppingItems")) || [];

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

  updateFilterItems();
  saveToLS();
  updateState();
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
  div.className = "item-name";
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
  li.setAttribute("item-id", item.id);

  li.appendChild(input);
  li.appendChild(div);
  li.appendChild(deleteIcon);

  return li;
}

function toogleCompleted(e) {
  const li = e.target.parentElement;
  li.toggleAttribute("item-completed", e.target.checked);

  updateFilterItems();
  saveToLS();
}
function removeItem(e) {
  const li = e.target.parentElement;
  shoppingList.removeChild(li);

  saveToLS();
  updateState();
}
function openEditMode(e) {
  const li = e.target.parentElement;

  if (li.hasAttribute("item-completed") == false) {
    e.target.contentEditable = true;
  }
}
function closeEditMode(e) {
  e.target.contentEditable = false;
  saveToLS();
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

  filterItems(filterBtn.getAttribute("item-filter"));
}
function filterItems(filterType) {
  const li_items = shoppingList.querySelectorAll("li");

  for (let li of li_items) {
    // Görünürlüğü sıfırla
    li.classList.remove("d-flex", "d-none");

    const item_completed = li.hasAttribute("item-completed");

    if (filterType === "complete" && !item_completed) {
      li.classList.add("d-none"); // Sadece tamamlanmış olanları gizleme
    } else if (filterType === "incomplete" && item_completed) {
      li.classList.add("d-none"); // Sadece tamamlanmamış olanları gizleme
    } else {
      li.classList.add("d-flex"); // Hepsini göster
    }
  }
}

function updateFilterItems() {
  const activeFilter = document.querySelector(".btn-primary[item-filter]");

  filterItems(activeFilter.getAttribute("item-filter"));
}
