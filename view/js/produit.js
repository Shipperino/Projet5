let cart;
let click = 0;
getCurrentTeddy();
// Récupere les teddy dans l'api
function getCurrentTeddy() {
    let request = new XMLHttpRequest();
    request.onload = createTeddyCard;
    request.onerror = function (data) {
        console.log(data);
    }
    request.open("GET", "http://localhost:3000/api/teddies");
    request.send();
}

// Stockage de l'item sur le localstorage

function addToBasket(e) {
    let panierSelectColor = e.target.parentNode.childNodes[7].value;
    console.log(panierSelectColor);
    console.log(e.target.parentNode.childNodes);
    ++click;
    let panier = localStorage.getItem("panier");
    console.log(panier)
    if (panier === null) {
        panier = [];
    } else {
        panier = JSON.parse(panier);
    }

    var notInBasket = true;

    for (let item of panier) {
        if (item.color === panierSelectColor && item.id === e.target.dataset.id) {
            notInBasket = false;
            item.count += 1;
            break;
        }
    }
    count = [];
    if (notInBasket)
        panier.push({
            color: panierSelectColor,
            id: e.target.dataset.id,
            imgurl: e.target.dataset.img,
            count: 1,
            price: e.target.dataset.price
        });
    cart.innerHTML = 'Ajouter au panier' + '(' + click + ')';
    localStorage.setItem("panier", JSON.stringify(panier));
    headCount();
    console.log(panier.length)
}

// Génere le contenu html du produit sélectionné
function createTeddyCard(e) {
    console.log(e);
    let teddyId = location.href.split('#')[1];
    let data = JSON.parse(e.target.responseText);
    for (let teddy of data) {
        if (teddy._id === teddyId) {
            let html = ` <div class="col-lg-4 col-md-6 mb-4 mx-auto pt-3 ">
    <div class="card h-100">
      <a href="#"><img class="card-img-top" src="${teddy.imageUrl}" alt=""></a>
      <div class="card-body">
        <h4 class="card-title">
          <a  href="produits.html#${teddy._id}">${teddy.name}</a>
        </h4>
        <h5>${teddy.price/100}€</h5>
        <p class="card-text">${teddy.description}</p>
      </div>
      <label for="color-select">Choose a color:</label>
      <select name="colors" id="color-select">  
      </select>
      <button class="bloc-button btn btn-lg btn-block cta-hero btn-atomic-grey" id="btn-cart"
      type="submit" aria-label="Envoyer" data-id="${teddy._id}" data-name="${teddy.name}" data-img="${teddy.imageUrl}" data-price="${teddy.price}" data-desc="${teddy.description}" >
      Ajouter au panier
        </button>
    </div>
  </div>`;
            document.getElementById("teddies").innerHTML += html;
            let options = '';
            for (color of teddy.colors) {
                options += '<option value="' + color + '">' + color + '</option>'
            }
            document.getElementById("color-select").innerHTML += options;
        }
    }

    cart = document.getElementById("btn-cart");
    console.log('cart');
    cart.addEventListener("click", function (e) {
        addToBasket(e);
    })
}