const crawl = () => {
    text = document.querySelector("input#url");
    num = document.querySelector("input#depth");
    let url = text.value;
    let depth = num.value;

    // sends the starting url to the server
    fetch(`http://localhost:3000/crawl?url=${url}&depth=${depth}`)
        .then(res => res.json())
        .then(res => {

            // if the responses is an error, show it
            if (typeof res.content == "string") {
                document.querySelector("#content").innerHTML = res.content;

                // if not, displays the results of the crawl
            } else {
                links = ""
                res.content.forEach(element => {
                    links += element + "<br>"
                });
                document.querySelector("#content").innerHTML += links;
            }
        });
};

document.getElementById("button").addEventListener("click", (e) => {
    document.getElementById("content").innerHTML = "The web was crawled, here you have your results: <br><br>"
    crawl();
});