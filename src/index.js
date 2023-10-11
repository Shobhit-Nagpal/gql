const continents = document.getElementById("continents-select");
const continentInfo = document.getElementById("info");

continentInfo.innerHTML = `<p class="text-center my-3">Please select a continent to show countries</p>`;

const initialQuery = `query {
    continents {
        name
        code
    }
}`;

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetchData(initialQuery);
    const continentData = response.data.continents; 

    for (let i = 0 ; i < continentData.length ; i++) {
        const continent = document.createElement("option");
        continent.value = continentData[i].code;
        continent.innerText = continentData[i].name;
        continents.appendChild(continent);
    }
});

continents.addEventListener("change", async (e) => {

    continentInfo.innerHTML = "";
    const code = e.target.value;

    if (code === "nil") { 
        continentInfo.innerHTML = `<p class="text-center my-3">Please select a continent to show countries</p>`;
       return;
    }

    const data = await getCountriesData(code);
    const countriesData = data.data.continent.countries;
    console.log(countriesData);


    const infoHeading = document.createElement("h2"); 
    infoHeading.innerText = "Countries";
    infoHeading.classList.add("mx-10");
    infoHeading.classList.add("text-3xl");
    infoHeading.classList.add("font-medium");
    infoHeading.classList.add("my-3");
    continentInfo.appendChild(infoHeading);

    const countriesList = document.createElement("ol"); 

    for (let i = 0 ; i < countriesData.length ; i++) {
        const country = document.createElement("li");
        country.classList.add("mx-20");
        country.classList.add("text-xl");
        country.classList.add("list-decimal");

        const countryInfo = document.createElement("div");
        const countryName = document.createElement("h3");
        const countryLangs = document.createElement("p");

        countryInfo.classList.add("my-4");

        countryName.classList.add("font-medium");
        countryName.classList.add("text-xl");

        const langs = [];

        if (countriesData[i].languages.length === 0) {
            langs.push("English");
        } else {

            for (let j = 0 ; j < countriesData[i].languages.length ; j++) {
                langs.push(countriesData[i].languages[j].name);
            }
        }

        countryName.innerText = countriesData[i].name;
        countryLangs.innerText = `The languages spoken in this country are ${langs.join(", ")}`;

        countryInfo.appendChild(countryName);
        countryInfo.appendChild(countryLangs); 
        country.appendChild(countryInfo);
        countriesList.appendChild(country);
    }

    continentInfo.appendChild(countriesList);
});

async function getCountriesData(countryCode) {
    const countriesQuery = `query getCountriesData($code: ID!) {
        continent(code: $code) {
            name
            countries {
                name
                languages {
                    name
                }
            }
        }
    }`;

    const data = await fetchData(countriesQuery, { code: countryCode });
    return data;
}
async function fetchData(query, variables) {
    const response = await fetch("https://countries.trevorblades.com/graphql", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    });

    const data = await response.json();

    return data;
}

