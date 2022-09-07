# signalforthings

---
### Usage
   Created with the intent to give different microcomputers/NASs/servers on a small network the ability to notify the administrator on events 
   via [Signal private messenger](https://signal.org/). This API takes your Web requests and run them as unix processes inside a docker container
   and makes use of [AsamK's signal-cli](https://github.com/AsamK/signal-cli) to get these messages to your personal devices. Signalforthings will not 
   add any functionality on top of signal-cli, the goal is to only need to register one cell number and broker messages from many other devices

#### Endpoints
- `/outgoing` will send a signal message to a user defined in the body (JSON):
   ```
   {
      "sender": "raspberry pi thermostat",
      "recipient": "15558675309",
      "message": "it's getting hot in here",
   }
   ```
  This is done alternatively in cURL:
   ```
  curl --location --request POST 'http://localhost:8080/outgoing' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "message": "it's getting hot in here",
   "sender": "raspberry pi thermostat",
   "recipient": "15558675309"
   }'
   ```
- `/outgoing/attached` will send a message with a file attachment up to 50MB. form-data is preferred for wrapping message content.
     
   ```
   curl --location --request POST 'http://localhost:8080/outgoing/attached' \
    --form 'message="testing sending a message with an attachment"' \
    --form 'sender="postman"' \
    --form 'recipient="15558675309"' \
    --form 'file=@"/path/to/file.png"'
   ```


#### Scheduling  
- there is a crontab like component in the project that will allow signalforthings to do something on a specific interval or schedule 
- currently a public ip reporting job is written in for my personal use and there is no way to dynamically create new jobs

#### Logging
- there is logging functionality that will generate a logfile at a path that is specified with an environment variable when docker is ran

### Building
1. `yarn install` to get node modules
2. `yarn build` will transpile `src/` to javascript and minify with webpack down to a single artifact
   at `build/signalforthings.js`
3. this can be ran locally from the project root with `yarn start`.

### Dockerizing
#### Environment Variables
```
PORT=8080                       # listen port for express
USER_AGENT=15558675309          # the cellular number to register with signal-cli
ADMIN=15551234567               # server owners cell number
LOGFILE=signalforthings.log     # logfile name and path
```
1. build the docker image with ` docker build . -t signalforthings:1.0.0`
2. to run the image`docker run -d -p 8080:8080 --env-file .env signalforthings:1.0.0`


### Registering the signal client
- read the [signal-cli man page](https://github.com/AsamK/signal-cli/blob/master/man/signal-cli.1.adoc) to register the container

### Notes

- https://blog.logrocket.com/how-to-set-up-node-typescript-express/
- https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52
- One specific file can be copied TO the container like:
`docker cp foo.txt container_id:/foo.txt`
- python script someone made to automate registration: https://gist.github.com/Vic3198/f0c9e17ef3d70e7b8c066bfd8cf4db2d 
