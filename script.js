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
            [0, 'rgb(242,240,247)'], [1, 'rgb(224,34,34']   // changing colorscale to suit website theme
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
        hovertemplate: "<b>%{text}</b>" + "<br>%{z}%" + "<extra></extra>" // when hovered users can see percentage value for the selected country
    }];

    let layout = {
        font: {
            color: 'rgb(235, 235, 235)',
            size: 15,
            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        title: {
            text: 'Using social media as news is worldwide<br><sup><i>Percentage of world population that uses social media as a news source in 2023</i></sup>',
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
        dragmode: false,    //removed drag as users may find resetting the view confusing, thus impacting on usability and user experience
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
        // the objects will store cumulative value and count value as they are integral to find the average score
        let fakeSentiment = {
            cumulativeVal: 0,
            count: 0
        };
        let realSentiment = {
            cumulativeVal: 0,
            count: 0
        };

        // iterating through each sentiment data csv and add it to the fake or real news cumulative value and count. I wrote this code with the aid of my tutor
        for (let i = 0; i < fakeSentimentData.length; i++) {
            fakeSentiment.cumulativeVal += Number(fakeSentimentData[i].compound)
            fakeSentiment.count += 1
            // if (i == 0) {
            //     fake =  Number(fakeSentimentData[i].compound)
            // }
        };
        for (let i = 0; i < realSentimentData.length; i++) {
            realSentiment.cumulativeVal += Number(realSentimentData[i].compound)
            realSentiment.count += 1
            // if (i == 0) {
            //     real =  Number(realSentimentData[i].compound)
            // }
        };


        let sentimentTrace = {
            x: ["real news", "fake news"],
            y: [-(realSentiment.cumulativeVal/realSentiment.count), -(fakeSentiment.cumulativeVal/fakeSentiment.count)], // conducting average based on the collected objects attributes
            marker: {
                color: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']   // colour to differentiate fake vs real news; also to conform to design colour pallette
            },
            type: 'bar',    // bar chart for easy comparison between the sentiment analysis values for real vs fake news
            hovertemplate: "<b>%{x}</b>" + "<br>-%{y}" + "<extra></extra>"
        }
        

        let layout = {
            font: {
                color: 'rgb(235, 235, 235)',
                size: 15,
                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            },
            title: "Fake news elicit strong negative emotions<br><sup><i>Average strength of negative emotions evoked from real vs fake news</i></sup>",
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
                ticktext: ['0 (weaker)', '-0.01', '-0.02', '-0.03', '-0.04 (stronger)', '-0.05'],
                automargin: true,
                title: "sentiment analysis score"
            }
        };

        Plotly.newPlot("sentimentGraph", [sentimentTrace], layout)
    });
});

// graphing the interaction data
Plotly.d3.csv("dataset/facebook-fact-check 2.csv", interactionData => {
    // shares, reactions, comments counts will be stored in trueNews or fakeNews objects
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

    // add the count into running total stored in the trueNews/fakeNews objects above. To ensure validity, I will collect 500 trueNews and fakeNews, with a total of 1000. Code snippet was written with the aid of my tutor
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

    // same attributes from trueNews and fakeNews will be compared together using pie chart
    let data = [{
        labels: ["real news", "fake news"],
        values: [trueNews.shares, fakeNews.shares],
        marker: {
            colors: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']
        },
        domain: {column: 0},
        title: "shares",
        type: "pie",
        name: ""
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.reactions, fakeNews.reactions],
        marker: {
            colors: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']
        },
        domain: {column: 1},
        title: "reactions",
        type: "pie",
        name: ""
    }, {
        labels: ["real news", "fake news"],
        values: [trueNews.comments, fakeNews.comments],
        marker: {
            colors: ['rgb(235, 235, 235)', 'rgb(224, 34, 34)']
        },
        domain: {column: 2},
        title: "comments",
        type: "pie",
        name: ""
    }, ]

    let layout = {
        font: {
            color: 'rgb(235, 235, 235)',
            size: 15,
        },
        title: "Users interact more with fake news<br><sup><i>Amount of interactions with fake and real news on Facebook</i></sup>",
        grid: {rows: 1, columns: 3},
        paper_bgcolor: '#1B1B1C',
    };

    Plotly.newPlot("interactionGraph", data, layout);
});

//graphing the policy data
Plotly.d3.csv("dataset/aus_policy_data.csv", ausData => {
    Plotly.d3.csv("dataset/china_policy_data.csv", chinaData => {
        Plotly.d3.csv("dataset/eu_policy_data.csv", euData => {
            Plotly.d3.csv("dataset/us_policy_data.csv", usData => {

                // Used to change date string from csv into Date object in an array
                function convertDatetime (array) {
                    let output = []
                    for (let i = 0; i < array.length; i++) {
                        let date = array[i].split("/")
                        output.push(new Date("20" + date[2], date[1], date[0]))
                    }
                    return output;
                }

                // removing duplicate values that has the same date, preferencing the one that has the highest value. This ensures that when hovered the data point does not show two values for a given date.
                function removeDups (array1, array2) {
                    outArray1 = [array1.at(-1)];    // date array
                    outArray2 = [array2.at(-1)];    // value array
                    for (let i = array1.length - 2; i >= 0; i--) {
                        // console.log(i, array1.at(i+1), (array1.at(i)));
                        if (array1.at(i+1) != array1.at(i)) {
                            outArray1.unshift(array1.at(i));
                            outArray2.unshift(array2.at(i));
                        };
                    };
                    return [outArray1, outArray2];
                }

                // get clean data that removes duplicates
                let ausDataClean = removeDups(unpack(ausData, "Date From"), unpack(ausData, "total_sum"));
                let chinaDataClean = removeDups(unpack(chinaData, "Date From"), unpack(chinaData, "total_sum"));
                let euDataClean = removeDups(unpack(euData, "Date From"), unpack(euData, "total_sum"));
                let usDataClean = removeDups(unpack(usData, "Date From"), unpack(usData, "total_sum"));
            
                // as removeDups() returns two arrays, the first index being the date and the second is the cumulative amount, separate the two and assign them to variables to ensure easy usage with Plotly
                let ausDate = convertDatetime(ausDataClean[0])
                let ausAmount = ausDataClean[1]
                let chinaDate = convertDatetime(chinaDataClean[0])
                let chinaAmount = chinaDataClean[1]
                let euDate = convertDatetime(euDataClean[0])
                let euAmount = euDataClean[1]
                let usDate = convertDatetime(usDataClean[0])
                let usAmount = usDataClean[1]

                // line chart suitable to show change in time
                let ausTrace = {
                    x: ausDate,
                    y: ausAmount,
                    mode: "line",
                    name: "Australia",
                    marker: {
                        color: "rgb(224, 34, 34)"   // diff colours to still keep with colour scheme, but also to differentiate the different traces
                    },
                    hovertemplate: "<b>Australia</b>" + "<br>%{x}: %{y}" + "<extra></extra>"
                }

                let chinaTrace = {
                    x: chinaDate,
                    y: chinaAmount,
                    mode: "line",
                    name: "China",
                    marker: {
                        color: "rgb(230, 94, 94)"
                    },
                    hovertemplate: "<b>China</b>" + "<br>%{x}: %{y}" + "<extra></extra>"
                }

                let euTrace = {
                    x: euDate,
                    y: euAmount,
                    mode: "line",
                    name: "EU",
                    marker: {
                        color: "rgb(235, 164, 164)"
                    },
                    hovertemplate: "<b>EU</b>" + "<br>%{x}: %{y}" + "<extra></extra>"
                }

                let usTrace = {
                    x: usDate,
                    y: usAmount,
                    mode: "line",
                    name: "USA",
                    marker: {
                        color: "rgb(235, 209, 209)"
                    },
                    hovertemplate: "<b>USA</b>" + "<br>%{x}: %{y}" + "<extra></extra>"
                }
                
                let layout = {
                    title: "An increasing interest in combating fake news <br><sup><i>Total amount of misinformation policies mentioned on Google</i></sup>",
                    hovermode: "closest",
                    paper_bgcolor: '#1B1B1C',
                    plot_bgcolor:  '#1B1B1C',
                    font: {
                        color: 'rgb(235, 235, 235)',
                        size: 15
                    },
                    annotations: [  // annotations to provide context to the data. Make sure annotaion box does not overlap with the line graph
                        {
                            x: "2016-12-04",
                            y: 0,
                            ax: 0,
                            ay: -120,
                            arrowcolor: "white",
                            font: {
                                color: "rgb(27, 27, 28",
                                size: 10
                            },
                            bgcolor: "rgb(235, 235, 235)",
                            text: "Pizzagate Shooting Scandal"
                        },
                        {
                            x: "2021-01-06",
                            y: 0,
                            ax: 0,
                            ay: -200,
                            arrowcolor: "white",
                            text: "Capitol Riot",
                            font: {
                                color: "rgb(27, 27, 28",
                                size: 10
                            },
                            bgcolor: "rgb(235, 235, 235)",
                        },
                        {
                            x: "2016-06-23",
                            y: 0,
                            ax: 0,
                            ay: -70,
                            arrowcolor: "white",
                            text: "Brexit Referrendum",
                            font: {
                                color: "rgb(27, 27, 28",
                                size: 10
                            },
                            bgcolor: "rgb(235, 235, 235)",
                        },
                        {
                            x: "2020-01-30",
                            y: 0,
                            ax: 0,
                            ay: -150,
                            arrowcolor: "white",
                            text: "Covid-19 Pandemic",
                            font: {
                                color: "rgb(27, 27, 28",
                                size: 10
                            },
                            bgcolor: "rgb(235, 235, 235)",
                        }
                    ],
                }


                let data = [ausTrace, chinaTrace, euTrace, usTrace]

                Plotly.newPlot('policyGraph', data, layout)
            });
        });
    });
});