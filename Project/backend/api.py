from    flask       import  Flask,          request
from    flask_cors  import  CORS
from    dotenv      import  load_dotenv
from    bs4         import  BeautifulSoup
import  requests
import  openai
import  os
import  time
import  json


def fetch_policy(url) -> str:
    print(url)
    header = {'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'}
    policy_html = requests.get(url, headers=header)
    soup = BeautifulSoup(policy_html.text, 'html.parser')
    print(soup)

    privacy_policy = ""
    paragraphs = soup.find_all(["h1", "h2", "h3", "p"])
    for paragraph in paragraphs:
        privacy_policy += f"{paragraph.text}\n"
    return privacy_policy

def summarize_text(data):

    '''

    '''

    
    json_format = '''
    {
        "score" : 5,
        "points":[
            {
                "title" : "",
                "description" : ""
            },
            {
                etc.
            }
        ],
        "negative_points":[
            {
                "title" : "",
                "description" : ""
            },
            {
                etc.
            }
        ]
    }
    '''

    prompt = f'The following text is the privacy policy of a website. You need to highlight the most important points of the privacy policy. Each points can only be 20-25 words long. Add points that are bad for the privacy of the user. Insert point which are good for the user only if there are some. you need to rank the privacy score of the page out of 10. return as JSON in the following format : \n{json_format}\n only put the JSON output and nothing else.'
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {
                "role" : "user",
                "content" : prompt
            },
            {
                "role" : "user",
                "content" : data
            }
        ]
    )
    summary = response['choices'][0]['message']['content'].replace('```', '').replace('json\n', '')
    print(summary)
    return json.loads(summary)

   


app = Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "back"

@app.route("/summarize", methods=['GET','POST']) 
def summarize():
    if request.method == 'POST':
        data = json.loads(request.data)
        if data['url']:
            privacy_policy = fetch_policy(data['url'])
            policy_summary = summarize_text(privacy_policy)
            return policy_summary
        else:
            return "Invalid Request"

    else:    
        return "Invalid Request"


if __name__ == "__main__":

    load_dotenv()

    openai.api_key = os.getenv('OPENAI_API_KEY')
    app.run(debug=True, port=5005)



