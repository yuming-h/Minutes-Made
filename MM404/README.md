# MM404
Meeting session process

## Setup
```
sudo docker build . -t mm404
```

## Running
```
sudo docker run -it -v $(pwd):/usr/mm/mm404 -p 5000:5000 mm404 python main.py
```
Then navigate to http://127.0.0.1:5000/ to test