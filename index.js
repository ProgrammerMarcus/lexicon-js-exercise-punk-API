async function getRandom() {
    try {
        const response = await fetch("https://api.punkapi.com/v2/beers/random");
        const data = await response.json();
        if (data[0].image_url) {
            document.querySelector(".random img").src = data[0].image_url;
        } else {
            document.querySelector(".random img").src = "beer.png";
        }
        document.querySelector(".random h3").innerText = data[0].name;
    } catch (error) {
        console.error("To many requests?", error);
        setTimeout(getRandom, 3000);
    }
}

document.querySelector(".navbar").addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-landing")) {
        document.querySelector(".page.search").classList.add("hidden");
        document.querySelector(".page.random").classList.remove("hidden");
        getRandom();
    } else if (e.target.classList.contains("nav-search")) {
        document.querySelector(".page.search").classList.remove("hidden");
        document.querySelector(".page.random").classList.add("hidden");
    }
});

document.querySelector("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let form = {
        name: e.currentTarget.querySelector(".name").value,
        hops: e.currentTarget.querySelector(".hops").value,
        malt: e.currentTarget.querySelector(".malt").value,
        lAbv: e.currentTarget.querySelector(".l-abv").value,
        gAbv: e.currentTarget.querySelector(".g-abv").value,
        bBrewed: e.currentTarget.querySelector(".b-brewed").value,
        aBrewed: e.currentTarget.querySelector(".a-brewed").value,
    };
    console.log(form);
});

addEventListener("load", () => {
    getRandom();
});
