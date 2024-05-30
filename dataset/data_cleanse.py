import csv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json

# cleaning Json file to add comma at end of each object; cleaning json file. Code snippet from https://stackoverflow.com/questions/60830724/add-a-comma-after-a-curly-brace-for-json-format
# comment/uncomment this snippet whenever required
dataJson = []

with open('politifact_factcheck_data.json') as f:
    for jsonObj in f:
        dataDict = json.loads(jsonObj)
        dataJson.append(dataDict)
     
with open('factcheck_clean.json', 'w') as jsonfile:
    json.dump(dataJson, jsonfile)


# get text content only depending on the verdict type
def get_content(file, verdict):
    out_list =[]
    with open(file) as f:
        reader = csv.reader(f)
        counter = 0
        for row in reader:
            if row[0] == verdict:
                if counter == 2463: #based on lowest value between true and false objects
                    break
                out_list.append(row[2])
                counter += 1
    out_list.pop(0) #remove label on top
    return out_list

# content only list
fake_content = get_content('factcheck_clean.csv', 'false')
real_content = get_content('factcheck_clean.csv', 'true')

# getting the sentiment value analyser
analyser = SentimentIntensityAnalyzer()

# conduct sentiment analysis for each content in a list
def sentiment_analysis(content_list):
    out_list = []
    for content in content_list:
        out_list.append(analyser.polarity_scores(content))
    
    # add sentiment value attribute to each json object based on the compound score
    for data in out_list:
        if data['compound'] >= 0.05:
            data['sentiment'] = 'positive'
        elif data['compound'] <= -0.05:
            data['sentiment'] = 'negative'
        else:
            data['sentiment'] = 'neutral'
    return out_list


fake_content_analysis = sentiment_analysis(fake_content)
real_content_analysis = sentiment_analysis(real_content)

# create new files with the analysed content
with open ('real_content_analysis.json', 'w') as jsonfile:
    json.dump(real_content_analysis, jsonfile)

with open ('fake_content_analysis.json', 'w') as jsonfile:
    json.dump(fake_content_analysis, jsonfile)