# MinutesMade - ip_to_slack.py
# Minutes Made, Copyright 2019
# Maintainer: Eric Mikulin

import requests
from subprocess import check_output
from pathlib import Path

SLACK_WEBHOOK = "https://hooks.slack.com/services/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"

def check_diff_and_cache_ip(new_ip):
    """Caches the ip and checks if it's changed at all"""
    old_ip_path = Path("jenkins_ip.conf")

    # Get the old ip
    old_ip = None
    if old_ip_path.exists():
        old_ip = check_output(["cat", old_ip_path.name])
        old_ip = old_ip.decode('utf-8').strip()

    # Write the new one to the file
    with open(old_ip_path, 'w') as old_ip_file:
        old_ip_file.write(new_ip)

    # Compare and return
    if not new_ip == old_ip:
        return True
    else:
        return False

def main():
    """Sends a message to the build-notifications slack channel with the url of the jenkins server"""
    my_ip = check_output(["curl", "-s", "https://ipinfo.io/ip"])
    my_ip = my_ip.decode('utf-8').strip()

    # Check if anything needs to be done
    if check_diff_and_cache_ip(my_ip):

        # Url of the jenkins server
        jenkins_url = "http://" + my_ip + ":8090"
        payload = {'text': "The current URL of the Jenkins's server is: "+jenkins_url}

        # Shoot that IP up to slack!
        requests.post(SLACK_WEBHOOK, json=payload)

if __name__ == "__main__":
    main()
