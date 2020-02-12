var text = new Vue({
    el: 'header',
    data: {
        title: 'Welcome to the Nnergix web crawler',
        subtitle: "Created by Omar Olmedo Ferrer on Feb 2020"
    }
})

var content = new Vue({
    el: '#content',
    data: {
        cont: 'The result of your crawl will be shown here'
    }
});

var form = new Vue({
    el: '#form',
    data: {
        url: '',
        depth: 1
    },
    methods: {
        send: function () {
            content.cont = "The web was crawled, here you have your results: \n \n";
            crawl();
        }
      }
})

const crawl = () => {
    // sends the starting url to the server
    fetch(`http://localhost:3000/crawl?url=${form.url}&depth=${form.depth}`)
        .then(res => res.json())
        .then(res => {

            // if the responses is an error, show it
            if (typeof res.content == "string") {
                content.cont = res.content;

                // if not, displays the results of the crawl
            } else {
                links = ""
                res.content.forEach(element => {
                    links += element + "\n"
                });
                content.cont += links;
            }
        });
};