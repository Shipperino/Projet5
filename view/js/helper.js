// Compteur panier pour chaque header

let headerCount = document.getElementById('headerCount');
function headCount() {
    let panier = JSON.parse(localStorage.getItem("panier"));
    if(panier===null){
      panier = [];
    }
    let numberOfItems = 0;
    for (let i = 0; i < panier.length; i++) {
      numberOfItems += panier[i].count;
    }
    headerCount.innerHTML = "panier" + " (" + numberOfItems + ")"
  };
  headCount();