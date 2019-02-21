# MinutesMade - ip_to_slack.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import requests
from subprocess import check_output

SLACK_WEBHOOK = "https://hooks.slack.com/services/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"

def main():
    """Sends a message to the build-notifications slack channel with the url of the jenkins server"""
    my_ip = check_output(["curl", "-s", "https://ipinfo.io/ip"])
    my_ip = my_ip.decode('utf-8').strip()

    # Url of the jenkins server
    jenkins_url = "http://" + my_ip + ":8090"

    payload = {'text': "The current URL of the Jenkins's server is: "+jenkins_url}

    # Shoot that IP up to slack!
    requests.post(SLACK_WEBHOOK, json=payload)

if __name__ == "__main__":
    main()
