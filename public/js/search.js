document.addEventListener("DOMContentLoaded", () => {

let searchbar = document.querySelector("#searchbar");
let criteriaselect = document.querySelector("#criteriaselect");
let mainbox= document.querySelector("#mainbox");
let outermainbox= document.querySelector(".outermainbox");
let navbarToggler = document.querySelector(".navbar-toggler");
let navcollapse = true;


async function searchlist(){
    let searchvalue = searchbar.value;
    let criteriavalue = criteriaselect.value;
    
    // console.log("searchvalue = " + searchvalue.trim());
    // console.log("criteriavalue = " + criteriavalue);

     const response = await fetch("http://localhost:8080/showlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({searchvalue : searchvalue, criteriavalue :criteriavalue  }),
    });
    
    const data = await response.json();  
    mainbox.innerHTML = data.html;    
}
searchbar.addEventListener("input", searchlist);
searchlist();

criteriaselect.addEventListener("click", searchlist)

async function navbarToggle(){
    if(navcollapse){
        navcollapse = false;
        outermainbox.style.marginTop = "240px";
    }else{
        navcollapse = true;
        outermainbox.style.marginTop = "10px";
    }
}
navbarToggler.addEventListener("click", navbarToggle);


});





