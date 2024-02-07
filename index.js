const cache = [];

function mergeCache(source) {
    for (let x of source) {
        cache[x.id] = x;
    }
}

async function getRandom() {
    try {
        const response = await fetch("https://api.punkapi.com/v2/beers/random");
        const data = await response.json();
        mergeCache(data);
        displayInfo(data[0].id)
        if (data[0].image_url) {
            document.querySelector(".random img").src = data[0].image_url;
        } else {
            document.querySelector(".random img").src = "beer.png";
        }
        document.querySelector(".random h3").innerText = data[0].name;
        document.querySelector(".random .card .click").dataset.id = data[0].id;
    } catch (error) {
        console.error("To many requests?", error);
        // setTimeout(getRandom, 3000);
    }
}

async function displayInfo(id) {
    console.log(id)
    document.querySelector(".info .description").innerText = cache[id].description;
    document.querySelector(".info .abv").innerText = cache[id].abv;
    document.querySelector(".info .volume").innerText = `${cache[id].volume.value} ${cache[id].volume.unit}`;
    document.querySelector(".info .ingredients").innerText = "replace malt, hops, and yeast";
    document.querySelector(".info .pairs").innerText = "replace with pair list";
    document.querySelector(".info .tips").innerText = cache[id].brewers_tips;
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

document.querySelector(".random .card .click").addEventListener("click", (e) => {
    displayInfo(Number(e.target.dataset.id))
})

addEventListener("load", () => {
    getRandom();
});
