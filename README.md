# Telnyx Text Response Sample App 
This app is intended to respond to any incoming text with a simple response utilizing the telnyx api.

## Getting Started
Getting started is simple!
To start you will need to set-up the following: 

- [Telnyx Account](https://telnyx.com/sign-up)
- Telnyx Phone number
- Use the following guide to set up your messaging profile [Messaging Profile Guide](https://support.telnyx.com/en/articles/3562059-setting-up-a-messaging-profile)
- [Ngrok](https://ngrok.com/) or something similar 
- [Node.Js](https://nodejs.org/en/download/ "Node.Js")
- [NPM](https://www.npmjs.com/get-npm "NPM")

## Install Dependencies

Install the Telnyx client 
- npm install telnyx

Create a new NPM project and install express and body-parser.
- npm init
- npm install express body-parser --save
- npm install dotenv  


## Making sure your application is visible and setting the webhook
You will need to make this application visible from the internet. ngrok (https://ngrok.com/) is great tool for this.
Please set up an account with ngrok.

Once the ngrok account is set up, you will need to authenticate it with the following command:
 
  $./ngrok authtoken 'authkey'
  
Next, run the Ngrok and point to the port to tunnel to. For this we will use 8080.

  $./ngrok http 8080.
  
![image](https://user-images.githubusercontent.com/35209904/114331249-a03c7c80-9b11-11eb-82b6-f8d1b11ed690.png)

After this, navigate to the messaging profile on your telnyx account. Select API v2 and set your inbound webhook to the ngrok url. 

![image](https://user-images.githubusercontent.com/35209904/114258433-714ccc00-9994-11eb-85df-b7b82de24617.png)

Please note: if you are using the free tier of ngrok, the URL will change each time ngrok is run.
Make sure you update the URL in the Webhook.

## Creating the Environment File 
You will need to create an .env file for this app.

Use the .env.example file to see the correct format.

The following environment variables need to be set:

| Variable | Description |
| :---:   | :-: |
| TELNYX_API_KEY | Your Telnyx API Key |
| TELNYX_PUBLIC_KEY | Your Telnyx Public Key |
| TELNYX_APP_PORT | Port|

## Install 
Run the following commands to get started:

$ git clone https://github.com/Kirk-Montrose/telnyx-challenge.git

## Run
Ensure ngrok is running 
Use the following command to start the server:

$ node index.js

Once the server has started, a message can be sent to the number given. 

![image](https://user-images.githubusercontent.com/35209904/114332217-c4995880-9b13-11eb-9f30-cccfa82cf60f.png)

