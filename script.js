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
        },
        hovertemplate: "<b>%{text}</b>" + "<br>%{z}%" + "<extra></extra>"
    }];

    let layout = {
        font: {
            color: 'rgb(235, 235, 235)',
            size: 15,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
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
        dragmode: false,
        hoverlabel: {
            bgcolor: "rgb(235, 235, 235)",
            bordercolor: "#1B1B1C",
            font: {
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            size: 14,
            color: '#1B1B1C'
            }
        }
    };

    Plotly.newPlot('worldGraph', data, layout);
});

// graphing sentiment data
Plotly.d3.csv("dataset/fake_content_analysis.csv", fakeSentimentData => {
    Plotly.d3.csv("dataset/real_content_analysis.csv", realSentimentData => {
        let fakeSentiment = {
            cumulativeVal: 0,
            count: 0
        };
        let realSentiment = {
            cumulativeVal: 0,
            count: 0
        };

        for (let i = 0; i < fakeSentimentData.length; i++) {
            fakeSentiment.cumulativeVal += Number(fakeSentimentData[i].compound)
            fakeSentiment.count += 1
            if (i == 0) {
                fake =  Number(fakeSentimentData[i].compound)
            }
        };
        for (let i = 0; i < realSentimentData.length; i++) {
            realSentiment.cumulativeVal += Number(realSentimentData[i].compound)
            realSentiment.count += 1
            if (i == 0) {
                real =  Number(realSentimentData[i].compound)
            }
        };


        let sentimentTrace = {
            x: ["real news", "fake news"],
            y: [realSentiment.cumulativeVal/realSentiment.count, fakeSentiment.cumulativeVal/fakeSentiment.count],
            marker: {
                color: ['rgb(235, 235, 235)', 'red']
            },
            type: 'bar',
            hovertemplate: "<b>%{x}</b>" + "<br>%{y}" + "<extra></extra>"
        }
        

        let layout = {
            font: {
                color: 'rgb(235, 235, 235)',
                size: 15,
                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            },
            title: "Sentiment analysis average of fake and real news",
            paper_bgcolor: '#1B1B1C',
            plot_bgcolor:  '#1B1B1C',
            hovermode: 'closest',
            hoverlabel: {
                bgcolor: "rgb(235, 235, 235)",
                bordercolor: "#1B1B1C",
                font: {
                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                size: 14,
                color: '#1B1B1C'
                }
            },
            height: 500
        };

        Plotly.newPlot("sentimentGraph", [sentimentTrace], layout)
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
        marker: {
            colors: ['rgb(235, 235, 235)', 'red']
        },
        domain: {column: 0},
        title: "shares",
        type: "pie",
        hoverinfo: 'skip'
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.reactions, fakeNews.reactions],
        marker: {
            colors: ['rgb(235, 235, 235)', 'red']
        },
        domain: {column: 1},
        title: "reactions",
        type: "pie",
        hoverinfo: 'skip'
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.comments, fakeNews.comments],
        marker: {
            colors: ['rgb(235, 235, 235)', 'red']
        },
        domain: {column: 2},
        title: "comments",
        type: "pie",
        hoverinfo: 'skip'
    }, ]

    let layout = {
        font: {
            color: 'rgb(235, 235, 235)',
            size: 15,
            // family:
        },
        title: "Percentage amount of different interactions with fake and real news on Facebook",
        grid: {rows: 1, columns: 3},
        paper_bgcolor: '#1B1B1C',
        annotations: [
            {
                text: "sdf sdfjkhs sfhsa ks safh ",
                showarrow: false,
                xref: 'paper',
                yref: 'paper',
                x: 50,
                y: 50
            }
        ],
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