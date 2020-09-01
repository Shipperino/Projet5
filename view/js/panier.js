 let panier = JSON.parse(localStorage.getItem("panier"));

 function getCartTeddy() {

   if (panier === null) {
     return;
   }
   for (let item of panier) {
     let request = new XMLHttpRequest();
     request.onload = createTeddyCard;
     request.onerror = function (data) {
       console.log(data);
     }
     request.panierItem = item;
     request.open("GET", "http://localhost:3000/api/teddies/" + item.id);
     request.send();
   }

 }
 getCartTeddy();

 let teddyCartCount = document.getElementById('numberofteddy');
 // Récupération du teddy en responseText + compteur 
 function createTeddyCard(e) {
   console.log();
   let teddy = JSON.parse(e.target.responseText);
   let html = ` <div class="col-lg-4 col-md-6 mb-4">
      <div class="card h-100">
        <a href="#"><img class="card-img-top"src="${teddy.imageUrl}" alt=""></a>
        <div class="card-body">
          <h4 class="card-title">
            <a  href="produits.html#${teddy._id}">${teddy.name}</a>
          </h4>
          <h5>${teddy.price/100}€</h5>        
          <h6 id="itemcount_${teddy._id}_${e.target.panierItem.color}"> ${e.target.panierItem.count} <h6>
          <h6> ${e.target.panierItem.color} <h6>
          <button data-id="${teddy._id}" data-color="${e.target.panierItem.color}" id="itemremove_${teddy._id}_${e.target.panierItem.color}">-</button>
          <button data-id="${teddy._id}" data-color="${e.target.panierItem.color}" id="itemAdd_${teddy._id}_${e.target.panierItem.color}">+</button>
          <p class="card-text">${teddy.description}</p>
          <h5></h5>
        </div>
      </div>
    </div>`;
   document.getElementById("teddies").insertAdjacentHTML("beforeend", html);
   console.log('teddy', teddy);

   let ajouterItem = document.getElementById(`itemAdd_${teddy._id}_${e.target.panierItem.color}`);
   console.log(ajouterItem);

   let removeItems = document.getElementById(`itemremove_${teddy._id}_${e.target.panierItem.color}`);

   ajouterItem.addEventListener('click', addItem);
   removeItems.addEventListener('click', removeItem);
 };

 // Somme de tous les éléments ajoutés

 function sum() {
   prixTotal = 0;
   if (panier === null) {
     panier = []
   }
   for (let i = 0; i < panier.length; i++) {
     prixTotal += panier[i].price / 100 * panier[i].count;
   }
   document.getElementById("totalcart").innerHTML = "Prix total = " + prixTotal + " " + "€";
 };
 sum();

 // Ajoute item au panier

 function addItem(e) {
   for (let i = 0; i < panier.length; i++) {
     if (panier[i].color === e.target.dataset.color && panier[i].id === e.target.dataset.id) {
       panier[i].count += 1;
       console.log('addToBasket', panier);
       localStorage.setItem("panier", JSON.stringify(panier));
       let itemCounter = document.getElementById("itemcount_" + panier[i].id + "_" + panier[i].color);
       itemCounter.innerHTML = panier[i].count;
       sum();
       headCount();
       break;
     }
   }
 };

 // Enleve un item du panier

 function removeItem(e) {
   for (let i = 0; i < panier.length; i++) {
     if (panier[i].color === e.target.dataset.color && panier[i].id === e.target.dataset.id) {
       panier[i].count = panier[i].count - 1;
       if (panier[i].count < 1) {
         panier.splice(i, 1);
         e.target.parentNode.parentNode.parentNode.remove();
       } else {
         let itemRemover = document.getElementById("itemcount_" + panier[i].id + "_" + panier[i].color);
         itemRemover.innerHTML = panier[i].count;
       }
       localStorage.setItem("panier", JSON.stringify(panier));
       sum();
       headCount();
       break;
     }
   }
 };
 // Gestion du formulaire
 class Contact {
   firstName
   lastName
   address
   city
   email
   constructor(firstName, lastName, address, city, email) {
     this.firstName = firstName;
     this.lastName = lastName;
     this.address = address;
     this.city = city;
     this.email = email;
   }
   toJson() {
     return {
       "firstName": this.firstName,
       "lastName": this.lastName,
       "address": this.address,
       "city": this.city,
       "email": this.email
     }
   }
 };


 //  Envoie les données panier + info client
 function sendForm() {
   let products = [];

   if (panier != null) {
     for (let item of panier) {
       console.log('testitemid', item.id);
       products.push(item.id);
     }
   };
   let firstName = document.getElementById("firstname").value;
   let lastName = document.getElementById("name").value;
   let address = document.getElementById("textbox2").value;
   let city = document.getElementById("textbox").value;
   let email = document.getElementById("input_504").value;
   let contact = new Contact(firstName, lastName, address, city, email);
   const body = {
     "products": products,
     "contact": contact
   };
   console.log(contact.toJson())
   console.log(products);
   var request = new XMLHttpRequest();
   request.open("POST", "http://localhost:3000/api/teddies/order");
   request.setRequestHeader("Content-Type", "application/json");
   request.onload = orderResponse;
   request.onerror = function (data) {
     console.log(data);
   };
   request.send(JSON.stringify(body));
 }


 function orderResponse(e) {

   let data = JSON.parse(e.target.responseText);
   console.log(panier)
   if (prixTotal == 0 && e.target.status === 400) {
     document.getElementById('sendinfo').disabled = true;
     alert('Votre panier est vide');
   }
   if (prixTotal > 0 && e.target.status === 400) {
     alert('Veuillez remplir le formulaire')
   }
   if (e.target.status === 201) {
     localStorage.clear();
     localStorage.setItem("orderPrice", prixTotal);
     localStorage.setItem("orderId", data.orderId);
     window.location.href = "confirmation.html";
   }

 }
 let sendInfo = document.getElementById('sendinfo');
 sendInfo.addEventListener('click', sendForm);

