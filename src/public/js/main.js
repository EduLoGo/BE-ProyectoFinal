const socket = io();

let form = document.getElementById("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const formDataObject = {};
  console.log(formDataObject)
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

document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('#btnDelete');
  console.log(deleteButtons)
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const article = this.closest('article');
      const id = article.getAttribute('id');
      const url = `/api/products/${id}`;
      fetch(url, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          alertify.success('Producto ${id} eliminado');
          return response.json();
        } else {
          throw new Error('Error al eliminar el producto');
        }
      })
      .then(data => {
        console.log('Producto eliminado:', data);
        article.remove();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  });
});

socket.on("renderProducts", (newProduct) => {
  const mainDiv = document.getElementById("cardProduct");
  const newCard = document.createElement("article");
  newCard.setAttribute("class", "card m-2 col-12 col-md-3 shadowBox");
  newCard.setAttribute("id", newProduct.id);
  newCard.innerHTML = `
    <div class="row h-100 g-2">
      <div class="col-md-4 d-flex justify-content-center align-items-center">
        <img src="${newProduct.thumbnail}" class="img-fluid rounded-start" alt=${newProduct.title} />
      </div>
      <div class="col-md-8 h-100">
        <div class="card-body">
          <h5 class="card-title d-flex justify-content-center">${newProduct.title}</h5>
          <p class="card-text">${newProduct.description}</p>
          <p class="card-text d-flex justify-content-center"><strong>$${newProduct.price}}</strong></p>
          <p class="card-text d-flex justify-content-end">
            <small class="text-body-secondary">Categoría: ${newProduct.category}</small>
          </p>
        </div>
      </div>
      <hr />
    </div>
    <div class="mt-4 mb-3 d-flex justify-content-around" id="btnEvents">
      <button class="btn btn-primary">Ver Más</button>
      <button class="btn btn-danger" id="btnDelete">Eliminar</button>
    </div>
    `;
  mainDiv.appendChild(newCard);
  document.getElementById("form").reset();
});
