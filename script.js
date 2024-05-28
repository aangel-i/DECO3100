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
            [0, 'rgb(242,240,247)'], [1, 'rgb(224,34,34']
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
            text: 'Percentage of world population that uses social media as a news source',
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
            y: [-(realSentiment.cumulativeVal/realSentiment.count), -(fakeSentiment.cumulativeVal/fakeSentiment.count)],
            marker: {
                color: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']
            },
            type: 'bar',
            hovertemplate: "<b>%{x}</b>" + "<br>-%{y}" + "<extra></extra>"
        }
        

        let layout = {
            font: {
                color: 'rgb(235, 235, 235)',
                size: 15,
                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            },
            title: "Average strength of negative emotions evoked from real vs fake news",
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
            height: 500,
            yaxis: {
                tickmode: 'array',
                tickvals: [0, 0.01, 0.02, 0.03, 0.04, 0.05],
                ticktext: ['0', '-0.01', '-0.02', '-0.03', '-0.04', '-0.05']
            }
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

    let data = [{
        labels: ["real news", "fake news"],
        values: [trueNews.shares, fakeNews.shares],
        marker: {
            colors: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']
        },
        domain: {column: 0},
        title: "shares",
        type: "pie",
        hoverinfo: 'skip'
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.reactions, fakeNews.reactions],
        marker: {
            colors: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']
        },
        domain: {column: 1},
        title: "reactions",
        type: "pie",
        hoverinfo: 'skip'
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.comments, fakeNews.comments],
        marker: {
            colors: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']
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
        title: "Amount of users interacting with fake and real news on Facebook",
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
Plotly.d3.csv("dataset/aus_policy_data.csv", ausData => {
    Plotly.d3.csv("dataset/china_policy_data.csv", chinaData => {
        Plotly.d3.csv("dataset/eu_policy_data.csv", euData => {
            Plotly.d3.csv("dataset/us_policy_data.csv", usData => {

                function convertDatetime (array) {
                    let output = []
                    for (let i = 0; i < array.length; i++) {
                        let date = array[i].split("/")
                        output.push(new Date("20" + date[2], date[1], date[0]))
                    }
                    return output;
                }

                // removing duplicate values that has the same date, preferencing the one that has the highest value
                // might not need this
                function removeDups (array1, array2) {
                    for (let i = 0; i < array1.length; i++) {
                        if (array1[i] == array1[i+1]) {
                            array2.splice(i);
                            array1.splice(i);
                            i -= 1
                        }
                    }
                }

                let ausDate = convertDatetime(unpack(ausData, "Date From"));
                let ausAmount = unpack(ausData, "total_sum");
                let chinaDate = convertDatetime(unpack(chinaData, "Date From"));
                let chinaAmount = unpack(chinaData, "total_sum");
                let euDate = convertDatetime(unpack(euData, "Date From"));
                let euAmount = unpack(euData, "total_sum");
                let usDate = convertDatetime(unpack(usData, "Date From"));
                let usAmount = unpack(usData, "total_sum");

                removeDups(ausDate, ausAmount)
                removeDups(chinaDate, chinaAmount)
                removeDups(euDate, euAmount)
                removeDups(usDate, usAmount)
                console.log(ausAmount)
                let ausTrace = {
                    x: ausDate,
                    y: ausAmount,
                    mode: "scatter",
                    name: "Australia"
                }

                let chinaTrace = {
                    x: chinaDate,
                    y: chinaAmount,
                    mode: "scatter",
                    name: "China"
                }

                let euTrace = {
                    x: euDate,
                    y: euAmount,
                    mode: "scatter",
                    name: "EU"
                }

                let usTrace = {
                    x: usDate,
                    y: usAmount,
                    mode: "scatter",
                    name: "USA"
                }

                let layout = {
                    title: "Cumulative amount of misinformation policies mentioned on Google",
                    hovermode: "closest",
                    paper_bgcolor: '#1B1B1C',
                    plot_bgcolor:  '#1B1B1C',
                    font: {
                        color: 'rgb(235, 235, 235)',
                        size: 15
                    },
                }

                let data = [ausTrace, chinaTrace, euTrace, usTrace]

                Plotly.newPlot('policyGraph', data, layout)
            });
        });
    });
});