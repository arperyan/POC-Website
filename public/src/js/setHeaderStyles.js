function setHeaderStyles(){
  let path = window.location.pathname;
  let activeHeaderEl;
  switch (path) {
    case "/":
      activeHeaderEl = document.getElementById("header_revenue");
      break;
    default:
      activeHeaderEl = document.getElementById("header_"+path.replace("/",""));
  }
  if(activeHeaderEl){
    activeHeaderEl.classList.add("active");
  }
}

setHeaderStyles();
