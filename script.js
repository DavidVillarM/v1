document.addEventListener("DOMContentLoaded", initialise);

let allInterpretes;
let cart = [];

function initialise(){
    console.log("Esta funcionando");
    fetchInterpretes();
    filterCategories();
    searchInterprete();
    openCart();
}

async function fetchInterpretes(){
    try {
        const resp = await fetch("https://fakestoreapi.com/products");
        const data = await resp.json();
        allInterpretes = data;
        displayInterpretes(allInterpretes);
        console.log(allInterpretes);
    } catch (error) {
        console.log(error);
    }
}

function displayInterpretes(interpretes) {
    const list = document.querySelector('#list');
    
    // Vaciar la lista antes de llenarla (opcional, dependiendo del caso)
    list.innerHTML = "";

    // Construir el contenido HTML
    const inter = interpretes.map((interprete) => {
        const { image, category, price, title, id } = interprete;

        return `
        <li class="card">
            <div class="img-content">
                <img src="${image}" alt="${category}" />
            </div>
            <div class="card-content">
                <p class="card-price">$${price ? price.toFixed(2) : "0.00"}</p>
                <h4 class="card-title">${title ? title.substring(0, 45) : "Untitled"}...</h4>
                <p class="card-desc hide">${category ? category.toUpperCase() : "Unknown"}</p>
            </div>
            <div class="btn-container">
                <button class="card-btn" onclick="addToCart(${id})">Add to Cart</button>
            </div>
        </li>`;
    }).join(""); // Combinar todos los elementos en un solo string

    // Asignar el contenido generado al DOM
    list.innerHTML = inter;
}

function filterCategories(){
    const select = document.querySelector("#filter-btn");
    select.addEventListener("change", filterInterpretes);

    function filterInterpretes(e){
        let list = document.querySelector("#list");
        let content = [];
        let option = e.target.value;
        list.innerHTML = "";

        switch (option) {
            case "men":
                content = allInterpretes.filter((interprete) => 
                    interprete.category === "men's clothing");
                break;
            case "women":
                content = allInterpretes.filter((interprete) => 
                    interprete.category === "women's clothing");
                break;
            case "jewellery":
                content = allInterpretes.filter((interprete) => 
                    interprete.category === "jewelery");
                break;
            case "electronics":
                content = allInterpretes.filter((interprete) =>
                    interprete.category === "electronics");
                break;
            case "all":
                content = allInterpretes;
                break;
            default:
                content = allInterpretes;
                break;
                }
            
        // Build the HTML for the filtered products
    const fillinter = content
    .map(({ image, category, price, title, id }) => `
        <li class="card">
            <div class="img-content">
                <img src="${image}" alt="${category || "Unknown"}" />
            </div>
            <div class="card-content">
                <p class="card-price">$${price ? price.toFixed(2) : "0.00"}</p>
                <h4 class="card-title">${title ? title.substring(0, 45) : "Untitled"}...</h4>
                <p class="card-desc hide">${category ? category.toUpperCase() : "Unknown"}</p>
            </div>
            <div class="btn-container">
                <button class="card-btn" onclick="addToCart(${id})">Add to Cart</button>
            </div>
        </li>
        `)
        .join("");

    // Insert the built HTML into the list element
    list.innerHTML = fillinter;
    }
}

function searchInterprete() {
    // Seleccionar los elementos necesarios
    const searchInput = document.querySelector('#search-input');
    const list = document.querySelector("#list");

    // Agregar el evento 'keyup' al input de búsqueda
    searchInput.addEventListener("keyup", (e) => {
      // Limpiar la lista actual
        list.innerHTML = "";

      // Obtener el término de búsqueda en minúsculas
        const searchTerm = e.target.value.toLowerCase();

      // Filtrar los intérpretes según el término de búsqueda
        const filteredInterpretes = allInterpretes.filter((interprete) =>
            interprete.title.toLowerCase().includes(searchTerm)
        );
      // Generar el HTML para los intérpretes filtrados
        const html = filteredInterpretes
            .map(({ image, price, category, title, id }) => `
            <li class="card">
                <div class="img-content">
                <img src="${image}" alt="${category || 'Unknown'}" />
                </div>
                <div class="card-content">
                <p class="card-price">$${price ? price.toFixed(2) : "0.00"}</p>
                <h4 class="card-title">${title ? title.substring(0, 45) : "Untitled"}...</h4>
                <p class="card-desc hide">${category ? category.toUpperCase() : "Unknown"}</p>
                </div>
                <div class="btn-container">
                <button class="card-btn" onclick="addToCart(${id})">Add to Cart</button>
                </div>
            </li>
            `)
            .join(""); // Combina todos los elementos HTML en un solo string

      // Insertar el HTML generado en la lista
        list.innerHTML = html;

      // Opción: Mostrar un mensaje si no hay resultados
        if (!filteredInterpretes.length) {
            list.innerHTML = "<p>No interpretes found.</p>";
        }
    });
}


function openCart(){
    const cartBtn = document.querySelector(".cart-container");
    cartBtn.addEventListener("click", seeModal);
}

function seeModal(){
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.remove("hide");
    body.classList.add("modal-open");
}

function closeCart() {
    const closeBtn = document.querySelector(".fa-xmark");
    closeBtn.addEventListener("click", closeModal);
}

function closeModal() {
    const body = document.body;
    const cartModal = document.querySelector(".modal");
    cartModal.classList.add("hide");
    body.classList.remove("modal-open");
}

function addToCart(id) {
    const searchCart= cart.find((interprete) => interprete.id === id);

    if(searchCart){
        alert("Ya solicito dicho servicio");
    }else{
        const oldInterprete = allInterpretes.find((interprete) => interprete.id === id);
        cart.push({ ...oldInterprete, quantity: 1});
    }
    console.log(cart);
}
