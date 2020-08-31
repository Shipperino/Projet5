getNameProducts();

function getNameProducts() {
  let request = new XMLHttpRequest();
  request.onload = productsResponse;
  request.onerror = function (data) {
    console.log(data);
  }
  request.open("GET", "http://localhost:3000/api/teddies");
  request.send();
}

function productsResponse(e) {
  let data = JSON.parse(e.target.responseText);
  for (let teddy of data) {
    console.log(teddy.name);
    let html = ` <div class="col-lg-4 col-md-6 mb-4 pt-3">
      <div class="card h-100">
        <a href="#"><img class="card-img-top" src="${teddy.imageUrl}" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a  href="produits.html#${teddy._id}">${teddy.name}</a>
          </h4>
          <h5>${teddy.price/100}€</h5>
          <p class="card-text">${teddy.description}</p>
        </div>
      </div>
    </div>`;
    document.getElementById("teddies").innerHTML += html;
  }
  console.log(data);
};