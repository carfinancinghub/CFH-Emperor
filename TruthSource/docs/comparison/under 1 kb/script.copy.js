// Dark Mode Toggle
document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Car Filtering
function filterCars() {
    let make = document.getElementById("makeFilter").value;
    let year = document.getElementById("yearFilter").value;
    
    document.querySelectorAll(".car-card").forEach(card => {
        let carMake = card.getAttribute("data-make");
        let carYear = card.getAttribute("data-year");
        
        if ((make === "" || carMake === make) && (year === "" || carYear === year)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
