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
    document.querySelector(".page.search").classList.add("hidden");
    document.querySelector(".page.random").classList.add("hidden");
    document.querySelector(".info").classList.remove("hidden");
    if (cache[id].image_url) {
        document.querySelector(".info img").src = cache[id].image_url;
    } else {
        document.querySelector(".info img").src = "beer.png";
    }
    document.querySelector(".info h3").innerText = cache[id].name;
    document.querySelector(".info .description").innerText = cache[id].description;
    document.querySelector(".info .abv").innerText = `ABV: ${cache[id].abv}%`;
    document.querySelector(".info .volume").innerText = `Volume: ${cache[id].volume.value} ${cache[id].volume.unit}`;
    document.querySelector(".info .ingredients").innerText =
        "Ingredients (malt):\n" +
        Object.values(cache[id].ingredients.malt)
            .map((v) => `${v.name}: ${v.amount.value} ${v.amount.unit}`)
            .join("\n") +
        "\n\nIngredients (hops):\n" +
        Object.values(cache[id].ingredients.hops)
            .map((v) => `${v.name}: ${v.amount.value} ${v.amount.unit}, ${v.add}, ${v.attribute}`)
            .join("\n") +
        `\n\n Ingredients (yeast):\n${cache[id].ingredients.yeast}`;
    document.querySelector(".info .pairs").innerText = `Food parings: ${cache[id].food_pairing.join(", ")}`;
    document.querySelector(".info .tips").innerText = cache[id].brewers_tips;
}

document.querySelector(".navbar").addEventListener("click", (e) => {
    if (e.target.classList.contains("nav-landing")) {
        document.querySelector(".page.search").classList.add("hidden");
        document.querySelector(".page.random").classList.remove("hidden");
        document.querySelector(".info").classList.add("hidden");
        getRandom();
    } else if (e.target.classList.contains("nav-search")) {
        document.querySelector(".page.search").classList.remove("hidden");
        document.querySelector(".page.random").classList.add("hidden");
        document.querySelector(".info").classList.add("hidden");
    }
});

function search() {
    let form = {
        name: document.querySelector(".name").value.replace(" ", "_"),
        hops: document.querySelector(".hops").value.replace(" ", "_"),
        malt: document.querySelector(".malt").value.replace(" ", "_"),
        lAbv: document.querySelector(".l-abv").value,
        gAbv: document.querySelector(".g-abv").value,
        bBrewed: document.querySelector(".b-brewed").value,
        aBrewed: document.querySelector(".a-brewed").value,
    };
    form.bBrewed = `${Array.from(form.bBrewed.matchAll(/(\d*)-(\d*)-/gm))[0][2]}-${Array.from(form.bBrewed.matchAll(/(\d*)-(\d*)-/gm))[0][1]}`;
    form.aBrewed = `${Array.from(form.aBrewed.matchAll(/(\d*)-(\d*)-/gm))[0][2]}-${Array.from(form.aBrewed.matchAll(/(\d*)-(\d*)-/gm))[0][1]}`;
    let search = `https://api.punkapi.com/v2/beers?`;
    if (form.name) {
        search = search.concat(`&beer_name=${form.name}`);
    }
    if (form.hops) {
        search = search.concat(`&hops=${form.hops}`);
    }
    if (form.malt) {
        search = search.concat(`&malt=${form.malt}`);
    }
    if (form.lAbv) {
        search = search.concat(`&abv_lt=${form.lAbv}`);
    }
    if (form.bBrewed) {
        search = search.concat(`&abv_gt=${form.gAbv}`);
    }
    if (form.aBrewed) {
        search = search.concat(`&brewed_after=${form.aBrewed}`);
    }
    if (form.bBrewed) {
        search = search.concat(`&brewed_before=${form.bBrewed}`);
    }
    console.log(form);
    fetch(search.concat(`&page=${document.querySelector(".results .page").value}&per_page=10`))
        .then((r) => r.json())
        .then((j) => {
            mergeCache(j)
            document.querySelector(".split .results .found").replaceChildren();
            for (let d of j) {
                document.querySelector(".split .results .found").insertAdjacentHTML("afterbegin", `<span data-id=${d.id} class="click">${d.name}</span>`);
            }
        });
}
document.querySelector("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    search();
});

document.querySelector(".results .found").addEventListener("click", (e) => {
    displayInfo(e.target.dataset.id)
});

document.querySelector(".results input").addEventListener("change", (e) => {
    if (document.querySelectorAll(".split .results .found span").length < 10) {
        e.target.value = e.target.value - 1;
    }
    search();
});

document.querySelector(".random .card .click").addEventListener("click", (e) => {
    displayInfo(Number(e.target.dataset.id));
    document.querySelector(".random").classList.add("hidden");
    document.querySelector(".info").classList.remove("hidden");
});

addEventListener("load", () => {
    getRandom();
});
