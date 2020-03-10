[logo]: https://lh3.googleusercontent.com/PNaoJawzkYqGc_86z4rjXo-5LNN0xKsw0uagt3Hc4owA1YhB3ngpjk0I8_5-P3M8wH7pgZIaYR4w2ulf09mQ3ChC1qtESLhSrHBQ5JQHDCWJKhMZRlNikDcorkD5tAw9PsB0sp5HhC-_aO_SQeqZxlPYbb4PJCt9M4XEA-yggoKWr_BbZnoI7n91V6rdTDDxvnR_7ediWzCSlvElEQ6jX7chjvZJQwJqH190XrWJYJDSMtlfVr0kcrcGKyhHob0567z4U0HAny52ONSECPNIQ56vl7qZUrujtpHO7ygOpvACpXtQ96cVoH6DDbLi2Q8G-PF_cchU5MC4WTCRx8cXqO0cm6xc0Ta-f28oXCu7tWzCHwPUctFOTEw12a_SQYTm4ahkbaA-CU45U0mHXMmeIg6w8OK35VH3FMTS4XQBji0rJz9-22rAHiNmKedg6nbK66KryYBd9FPa7ZhIXpk4oNA9ccLolvc08svdMGagh4-5J9AyQ4nua_qElqbrZne1pn2dTTkGmaGBk5hycip60w9s_l0og5Ezav0nsRNhCo7cYHh280m0B3c6KEDjm7jQSYwRCon_JQtRj0ytBV-sv7tZOMUkMZpHpQz-62CWPlHj3Tcj8G3AOELy7shxzuBq9TDu4iqFPQplOH-uWDwGLrqvdByY2WA-gb12oehMfT-2mfkb_fGc_i6rOYD_iwkELfQEgXqWfSMCmGGfGHdMQt8Z93h9hjfvGzWyQ7ElRiMDONc1=w960-h720-no

# Minutes Made

🏆 Winning project at NWHacks 2019! A web application to take meeting minutes for your team. Performs action items on command and updates your teammates so you don't have to. ⏳

Read more at:  https://devpost.com/software/minutes-made 



## Features

- 🎙️ Live transcriptions with speaker recognition and speech diarization: Minutes Made recognizes your voice and tells it apart fromn your teammates.
- ⚛️ Reactjs User Interface designed with usability in mind.
- 📝 Keeps all your transcripts together so you can review meetings and keep track of what's important.
- 🎬 Takes action. Integrations for Slack and Jira to update your team on what's important. Let Minutes Made know what needs to be done and it will keep everyone informed. 



## Architecture

Our team wanted to learn more about microservice architecture since it's something that's becoming more widely used in industry, yet is never being taught in schools. We decided to focus on designing around microservice principles and being able to scale, develop, and deploy each service independently. We ran into the usual snags such as Async IO, persisting data across multiple services, design patterns, etc. Of course, the design is not entirely perfect and we had to make some tough decisions in terms of trade-offs, but we felt we learned a lot from designing such a complex system from the ground up.



## Services

High Level View of the Services we built:

- 🍊 Orange-Juice: The frontend service built with Reactjs, focusing on ease of use.
- 🥤 Pulp-Free: Web-server with the main Client API. Outer layer connecting the Frontend to the rest of our services.
- ❌ Four-Oh-Four: Handles the meeting logic. Spins up instances of meetings and kills them when necessary.
- 🎛 Emm-Ell: Handles biometrics, speech recognition.
- 📡 Nginx: It's Nginx.
- 🍷 Kool-Aid: Relational database API. Reading/writing service.
- 👁 Aye-Aye: Inbound-integration service. Receives and processes inbound requests from integrations like Slack and Jira. 
- 👀 Eye-Oh: Sends outbound requests to integrations.


Rare insider photo of prototype diagram at Minutes Made HQ:
![diagram][logo]



## Running Locally

We hosted the project on AWS for a while but it was getting too expensive. Turns out begging Jeff Bezos for a student discount doesn't work too well either. For now it's possible to download the source and run locally through Docker-Compose.

### Setup

Build packages

```
sudo docker-compose build
```

### Running

Run all services locally

```
sudo docker-compose up
```

