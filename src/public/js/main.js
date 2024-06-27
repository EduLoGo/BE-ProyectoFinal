const socket = io();

let form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); //si con esto ya no se recarga

  const formData = new FormData(form);
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch("/realtimeproducts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  });
});

socket.on("renderProducts", (newProduct) => {
  const mainDiv = document.getElementById("cardProduct");
  const newCard = document.createElement("article");
  newCard.setAttribute("class", "card m-2 col-12 col-md-3 shadowBox");
  newCard.innerHTML = `
    <div class="row g-0">
      <div class="col-md-4 d-flex justify-content-center align-items-center">
        <img src="${newProduct.thumbnail}" class="img-fluid rounded-start" alt=${newProduct.title} />
      </div>
      <div class="col-md-8">
        <div class="card-body">
          <h5 class="card-title d-flex justify-content-center">${newProduct.title}</h5>
          <p class="card-text">${newProduct.description}</p>
          <p class="card-text d-flex justify-content-center"><strong>$ ${newProduct.price}</strong></p>
          <p class="card-text d-flex justify-content-end">
            <small class="text-body-secondary">Categoría:${newProduct.category}</small>
          </p>
        </div>
      </div>
    </div>
    `;
  mainDiv.appendChild(newCard);
  document.getElementById("form").reset();
});
