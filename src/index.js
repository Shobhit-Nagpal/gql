const query = ` {
    countries {
        code
    }
} `;

fetch("https://countries.trevorblades.com/graphql", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        query: query
    })
})
    .then(res => res.json())
    .then(data => console.log(data))
