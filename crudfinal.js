console.log("CRUD connected");
//CRUD (Create, Read, Update, Delete).................................
/*
  Create -- storing data to remote source
  Read -- data source - UI (visual)
  Update -- modifying the existing data
  Delete -- removing data
*/
(() => {
  // DOM selections...................................................
  const filterInput = document.querySelector("#filter");
  const inputForm = document.querySelector("form");
  const submitBtn = document.querySelector(".submitBtn button");
  const collection = document.querySelector(".collection");
  const elmMsg = document.querySelector(".msg");
  const nameInput = document.querySelector(".product-name");
  const priceInput = document.querySelector(".product-price");
  // products storage...if local has product then take it otherwise empty array
  let allProducts = localStorage.getItem("productsLocal")
    ? JSON.parse(localStorage.getItem("productsLocal"))
    : [];

  // showing and clearing msg...........................................
  // function for clearing message
  function clearMessage() {
    elmMsg.textContent = "";
  }

  // function for showing message
  function showMessage(msg, action = "success") {
    const message = `<div class="alert alert-${action}" role="alert">
  ${msg}
  </div>`;
    elmMsg.insertAdjacentHTML("afterbegin", message);
    setTimeout(() => {
      clearMessage();
    }, 2000);
  }

  // adding data..........................................................
  // function for receiving data
  function receiveData() {
    const name = nameInput.value;
    const price = priceInput.value;
    return { name, price };
  }

  // function for validating data
  function validateData(name, price) {
    let isValid = true;
    if (name === "" || price === "") {
      isValid = false;
      showMessage("Please provide necessary info", "danger");
    }
    if (Number(price) !== Number(price)) {
      isValid = false;
      showMessage("Please provide valid info", "danger");
    }
    return isValid;
  }

  // function for adding new product
  function addProduct(name, price) {
    const id =
      allProducts.length === 0 ? 1 : allProducts[allProducts.length - 1].id + 1;
    const product = {
      id,
      name,
      price,
    };
    allProducts.push(product);
    return product;
  }

  // function for reseting data
  function resetInput() {
    nameInput.value = "";
    priceInput.value = "";
  }

  // function for adding product to local storage
  function addProductToLocalStorage(product) {
    let products;
    //checking whethere local storage is empty or not
    if (localStorage.getItem("productsLocal")) {
      //if local is not empty then take it in products
      products = JSON.parse(localStorage.getItem("productsLocal"));
      //pushing new product to products
      products.push(product);
    } else {
      //if local is empty then products is an empty array
      products = [];
      //pushing new product to products
      products.push(product);
    }
    //sort products in descending order before storing in local
    //products = products.sort((a, b) => b.id - a.id);
    //products store in local
    localStorage.setItem("productsLocal", JSON.stringify(products));
  }

  // showing data...........................................................
  // function for showing products to UI
  function showProductToUI(productInfo) {
    //removing no prodcu show msg (form showProductsFromLocalToUI())
    const noProduct = document.querySelector(".noProduct");
    if (noProduct) noProduct.remove();
    //destructing productInfo
    const { id, name, price } = productInfo;
    const product = `<li
  class="list-group-item collection-item d-flex flex-row justify-content-between" data-id = "${id}"
>
  <div class="product-info">
    <strong>${name}</strong>- <span class="price">$${price}</span>
  </div>
  <div class="action-btn">
    <i class="fa fa-pencil-alt float-right me-2 edit-product"></i>
    <i class="fa fa-trash-alt float-right delete-product"></i>
  </div>
</li>`;

    collection.insertAdjacentHTML("beforeend", product);
  }

  // function for showing products from local to UI
  function showProductsFromLocalToUI(products) {
    collection.textContent = "";
    let liElms;
    liElms =
      products.length === 0
        ? `<li class="list-group-item collection-item d-flex flex-row justify-content-between noProduct">Sorry! No product available now.</li>`
        : "";

    products.forEach((product) => {
      const { id, name, price } = product;
      liElms += `<li
    class="list-group-item collection-item d-flex flex-row justify-content-between" data-id = "${id}"
  >
    <div class="product-info">
      <strong>${name}</strong>- <span class="price">$${price}</span>
    </div>
    <div class="action-btn">
      <i class="fa fa-pencil-alt float-right me-2 edit-product"></i>
      <i class="fa fa-trash-alt float-right delete-product"></i>
    </div>
  </li>`;
    });
    collection.insertAdjacentHTML("afterbegin", liElms);
  }

  // updating data........................................................
  // function for finding data to update
  function findDataForUpdate(id) {
    return allProducts.find((product) => product.id === id);
  }

  // function for populate data to update (getting data into input fields)
  function populateData(product) {
    //getting product info into input fields for updating
    nameInput.value = product.name;
    priceInput.value = product.price;
    //changing button content from Submit to Update
    submitBtn.textContent = "Update";
    //adding a class for new design
    submitBtn.classList.add("btn-info");
    //adding a class in submit button to catch for event handling(look in handleFormSubmit())
    submitBtn.classList.add("update-product");
    //adding id as dataset updateId to catch product for updating(used in handleFormSubmit())
    submitBtn.setAttribute("data-updateid", product.id);
  }

  // function for updating product
  function updateProduct(productForUpdate) {
    const updatedProduct = allProducts.map((product) => {
      if (product.id === productForUpdate.id) {
        return {
          ...product,
          name: productForUpdate.name,
          price: productForUpdate.price,
        };
      } else {
        return product;
      }
    });
    return updatedProduct;
  }

  // function for updating in local storage
  function updateInLocalStorage(products) {
    localStorage.setItem("productsLocal", JSON.stringify(products));
  }

  // function for clearing update form after update data
  function clearUpdateForm() {
    submitBtn.textContent = "Submit";
    submitBtn.classList.remove("btn-info");
    submitBtn.classList.remove("update-product");
    submitBtn.removeAttribute("data-updateid");
  }

  // removing data............................................................
  // function for removing product from mamory
  function removeProduct(id) {
    allProducts = allProducts.filter((product) => product.id !== id);
  }

  // function for removing product from UI
  function removeProductFromUI(id) {
    document.querySelector(`[data-id = "${id}"]`).remove();
    showMessage("Product deleted successfully!", "warning");
  }

  // function for removing product from local
  function removeProductFromlocalStorage(id) {
    let products;
    products = JSON.parse(localStorage.getItem("productsLocal"));
    products = products.filter((product) => product.id !== id);
    localStorage.setItem("productsLocal", JSON.stringify(products));
  }

  // function for event.........................................................
  // function for getting product id
  function getProductId(evt) {
    const productLi = evt.target.parentElement.parentElement;
    const id = Number(productLi.getAttribute("data-id"));
    return id;
  }

  // function for event handler to remove/edit data
  function manipulateProduct(evt) {
    //getting prduct id
    const id = getProductId(evt);

    if (evt.target.classList.contains("delete-product")) {
      //removing product form memory
      removeProduct(id);
      //removing product form UI
      removeProductFromUI(id);
      //removing product form local storage
      removeProductFromlocalStorage(id);
    } else if (evt.target.classList.contains("edit-product")) {
      //finding data to update using id
      const findProduct = findDataForUpdate(id);
      populateData(findProduct);
    }
  }

  // function for form submit handler
  function handleFormSubmit(evt) {
    //common for add and update..........................
    evt.preventDefault();
    //receiving data from input and destruct
    const { name, price } = receiveData();
    //checking validation
    const isValid = validateData(name, price);
    //if invalid then function return/won't execute further code.
    if (!isValid) return;
    //reset input fields after adding product
    resetInput();

    //operations for updating................................
    //handler for updating product by catching class name (lock populateData())
    if (submitBtn.classList.contains("update-product")) {
      //id comes from populateData()(dataset added in populateData())
      const id = Number(submitBtn.dataset.updateid);
      //getting product for updating
      const product = {
        id,
        name,
        price,
      };
      //function call for updating product and take it in allProducts after updateing
      allProducts = updateProduct(product);
      //function call for showing products after update
      showProductsFromLocalToUI(allProducts);
      //function call for update in localstorage
      updateInLocalStorage(allProducts);
      //function call for clear update form
      clearUpdateForm();
      //showing success msg after updating successfully
      showMessage("Product Updated successfully");
    } else {
      //operations for adding new..................................
      //adding new product
      const products = addProduct(name, price);
      //adding new product to local storage
      addProductToLocalStorage(products);
      //showing new product in UI
      showProductToUI(products);
      //showing success msg after adding successfully
      showMessage("Product added successfully");
    }
  }

  // function for filter input handler
  function handleFilter(evt) {
    const filterText = evt.target.value;
    const filterdProduct = allProducts.filter((product) =>
      product.name.toLowerCase().includes(filterText.toLowerCase())
    );
    showProductsFromLocalToUI(filterdProduct);
  }

  // events....................................................................
  function init() {
    // event handler for form submit
    inputForm.addEventListener("submit", handleFormSubmit);

    // event for collection ul to remove or edit data using event delegation
    collection.addEventListener("click", manipulateProduct);

    // event for showing data from local to UI
    document.addEventListener("DOMContentLoaded", () =>
      showProductsFromLocalToUI(allProducts)
    );

    // event for filtering data
    filterInput.addEventListener("keyup", handleFilter);
  }
  init();
})();
