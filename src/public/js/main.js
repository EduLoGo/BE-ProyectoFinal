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
  })
});

socket.on("products", (data) => {
  const mainDiv = document.getElementById("mainDiv");
  const newCard = document.createElement("div");
  newCard.setAttribute("class", "col-6");
  newCard.innerHTML = `
  <div class="card mb-2">
  <div class="card-header">
      <h6 class="card-title">${data.title}</h6>
      </div>
      <div class="card-body row">
      <p>Descripción: ${data.description}</p>
      <div class="card-text col-6">
        <li>Precio: $${data.price}</li>
        </div>
        <div class="card-text col-6">
        <li>Stock Disponible: ${data.stock}</li>
      </div>
    </div>
  </div>
  `;
  mainDiv.appendChild(newCard);
  document.getElementById("form").reset();
});