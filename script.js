const unpack = (data, key) => data.map(row => row[key]);

// graphing the choropleth graph
Plotly.d3.csv("dataset/world-data.csv", worldData => {
    let country = unpack(worldData, "country")
    let percentage = unpack(worldData, "percentage_value")

    let data = [{
        type: 'choropleth',
        locations: country,
        z: percentage,
        text: country,
        locationmode: "country names",
        colorscale: [
            [0, 'rgb(242,240,247)'], [1, '#ff1100']
        ],
        marker: {
            line: {
                color: 'rgb(242,240,247)',
                width: 0.5,
            }
        },
        colorbar: {
            title: "Pecentage of population",
        }
    }];

    let layout = {
        font: {
            color: 'rgb(235, 235, 235)',
            size: 15,
            // family:
        },
        title: {
            text: 'Percentage of the population that uses social media as a news source',
        },
        geo: {
            showframe: false,
            projection: {
                type: 'mercator',
            },
            bgcolor: '#1B1B1C',
            coastlinecolor: '#FFFFFF'
        },
        paper_bgcolor: '#1B1B1C',
        width: 1000,
        height: 800,
        dragmode: false
    };

    Plotly.newPlot('worldGraph', data, layout);
});

// graphing sentiment data
Plotly.d3.csv("dataset/fake_content_analysis.csv", fakeSentimentData => {
    Plotly.d3.csv("dataset/real_content_analysis.csv", realSentimentData => {
        let fakeSentimentCount = {
            positive: 0,
            negative: 0,
            neutral: 0
        };
        let realSentimentCount = {
            positive: 0,
            negative: 0,
            neutral: 0
        };

        for (let i = 0; i < fakeSentimentData.length; i++) {
            switch (fakeSentimentData[i].sentiment) {
                case ("positive"):
                    fakeSentimentCount.positive++
                    break;
                case ("negative"):
                    fakeSentimentCount.negative++
                    break;
                case ("neutral"):
                    fakeSentimentCount.neutral++
                    break;
            }
        };
        for (let i = 0; i < realSentimentData.length; i++) {
            switch (realSentimentData[i].sentiment) {
                case ("positive"):
                    realSentimentCount.positive++
                    break;
                case ("negative"):
                    realSentimentCount.negative++
                    break;
                case ("neutral"):
                    realSentimentCount.neutral++
                    break;
            }
        };

        let fakeNewsTrace = {
            x: ["share count", "reaction count", "comment count"],
            y: [fakeNews.shares, fakeNews.reactions, fakeNews.comments],
            name: "Fake News",
            type: "bar"
        }

        let realNewsTrace = {
            x: ["share count", "reaction count", "comment count"],
            y: [trueNews.shares, trueNews.reactions, trueNews.comments],
            name: "Real News",
            type: "bar"
        }
        
        let data = [{
            labels: ["positive", "negative", "neutral"],
            values: [realSentimentCount.positive, realSentimentCount.negative, realSentimentCount.neutral],
            domain: {column: 0},
            name: "Real News",
            type: "pie"
        }, {
            labels: ["positive", "negative", "neutral"],
            values: [fakeSentimentCount.positive, fakeSentimentCount.negative, fakeSentimentCount.neutral],
            domain: {column: 1},
            name: "Fake News",
            type: "pie"
        }];

        let layout = {
            font: {
                color: 'rgb(235, 235, 235)',
                size: 15,
                // family:
            },
            title: "Sentiment analysis average of fake and real news",
            grid: {rows: 1, columns: 2},
            paper_bgcolor: '#1B1B1C'
        };

        Plotly.newPlot("sentimentGraph", data, layout)
    });
});

// graphing the interaction data
Plotly.d3.csv("dataset/facebook-fact-check 2.csv", interactionData => {

    let trueNews = {
        shares: 0,
        reactions: 0,
        comments: 0,
        count: 0,
    };

    let fakeNews = {
        shares: 0,
        reactions: 0,
        comments: 0,
        count: 0
    };

    for (let i = 0; i < interactionData.length; i++) {
        if (interactionData[i].Rating == "mostly true" && trueNews.count < 500) {
            trueNews.shares += Number(interactionData[i].share_count)
            trueNews.reactions += Number(interactionData[i].reaction_count)
            trueNews.comments += Number(interactionData[i].comment_count)
            trueNews.count++
        }
        else {
            if (fakeNews.count >= 500) {continue}
            fakeNews.shares += Number(interactionData[i].share_count)
            fakeNews.reactions += Number(interactionData[i].reaction_count)
            if(Number(interactionData[i].comment_count)) {
                fakeNews.comments += Number(interactionData[i].comment_count)
            }
            fakeNews.count++
        }
    };

    // let fakeNewsTrace = {
    //     x: ["share count", "reaction count", "comment count"],
    //     y: [fakeNews.shares, fakeNews.reactions, fakeNews.comments],
    //     name: "Fake News",
    //     type: "bar"
    // }

    // let realNewsTrace = {
    //     x: ["share count", "reaction count", "comment count"],
    //     y: [trueNews.shares, trueNews.reactions, trueNews.comments],
    //     name: "Real News",
    //     type: "bar"
    // }

    let data = [{
        labels: ["real news", "fake news"],
        values: [trueNews.shares, fakeNews.shares],
        domain: {column: 0},
        name: "shares count",
        type: "pie"
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.reactions, fakeNews.reactions],
        domain: {column: 1},
        name: "reactions count",
        type: "pie"
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.comments, fakeNews.comments],
        domain: {column: 2},
        name: "comments count",
        type: "pie"
    }]

    let layout = {
        font: {
            color: 'rgb(235, 235, 235)',
            size: 15,
            // family:
        },
        title: "Average count for different type of interactions with fake and real news on Facebook",
        grid: {rows: 1, columns: 3},
        paper_bgcolor: '#1B1B1C'
    };

    Plotly.newPlot("interactionGraph", data, layout);
});

//graphing the policy data
// Plotly.d3.csv("dataset/google_all_cleaned_new.csv", policyData => {
//     dateData = []
//     countData = []
//     for( let i = 0; i <= policyData.length; i++) {
//         if (!dateData.includes(policyData[i].Date_From)) {
//             dateData.push(policyData[i].Date_From)
//             countData.append[1]
//         } elif (dateData.includes(policyData[i].Date_From)) {

//         }
//     }
// });