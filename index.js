/*########################Food Text Message Response App########################
#      This application responds to text messages that a user send
#      it will respond based on the content in the users message
#
#      Please make sure this is externally accessible. ngrok (https://ngrok.com/) 
#      This is a great tool, the website will show you how to set it up.
##############################################################################*/
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
var textMessageId = 1;


const telnyx = require('telnyx')(process.env.TELNYX_API_KEY);
const port = process.env.TELNYX_APP_PORT || 8080;  //Just default to 8080 if nothing is entered


//Provides a default message if the message does not match a key. 
const otherResponseMessage = 'Please send either the word ‘pizza’ or ‘ice cream’ for a different response'

/* This response pair tell the program what message to look for and if found what to respond with
   Key = inboundMessage ===>  Value = Reponse back to user   
   I did it this way so that its easy to add more responses,
   Alternatively, these could be extracted from a config file.
   This also makes the assumption that text messege matches the extact keyword*/
var responsePairs = {                
      'PIZZA'      :   'Chicago pizza is the best', 
      'ICE CREAM'  :   'I prefer gelato',
}     

//Use the webhook validator
const webhookValidator = (req, res, next) => {
      try {
          telnyx.webhooks.constructEvent(
          JSON.stringify(req.body, null, 2),
          req.header('telnyx-signature-ed25519'),
          req.header('telnyx-timestamp'),
          process.env.TELNYX_PUBLIC_API_KEY
        )
        next();
        return;
      }
      catch (e) {
        console.log(`Invalid webhook: ${e.message}`);
        return res.status(400).send(`Webhook Error: ${e.message}`);
      }
    };

app.use(bodyParser.json());

/*Accepts webhook from telnyx
Note: if using ngrok.com insure the webhook url is set to the one on the ngrok.*/
app.post('/webhook', async  (req, res) => {      
      try {  
            res.sendStatus(200) //Send back it worked

            const incomingMessage  =  req.body.data.payload.text
            const incomingPhoneNumber =  req.body.data.payload.from.phone_number
            const ourNumber = req.body.data.payload.to[0].phone_number; 

            //I'm sure there is a better way to do this, but this works for 
            //Checks for only message.received message
            if(req.body.data.event_type == 'message.received'){
                  console.log(`\nMessage Received From: ${incomingPhoneNumber} \nText Contents :  ${incomingMessage}`)
                  var message =   SendReturnMessage(FindProperResponse(incomingMessage), incomingPhoneNumber,ourNumber)    
                  console.log(`The following message will be sent back to the sender: \n${message}`);                     
            }          
      } catch(e){
            console.error(e.message) //Normally would use logging tool
      }  
});

//This just assumes a response to a single number. 
 function SendReturnMessage(message, outboundNumber, ourNumber){
      telnyx.messages.create({
            'from': ourNumber,
            'to': outboundNumber,
            'text': message
      },
      ).catch((err, response) => {
            console.log('Issue sending the message');
            console.log(err);
        });; 

    return message
}

/*Searches the key value pairs for the correct 
reponse based on the message, if no key is found
then it will return the default message*/
 function FindProperResponse(messageContent){
      if (messageContent.toUpperCase() in responsePairs) {
            return responsePairs[messageContent.toUpperCase()];
      }else {      
            return otherResponseMessage;
      }    
}

app.use(webhookValidator); 
app.listen(port, () => console.log(`                                                                
_____         _      _____            _____             _         
|_   _|___ _ _| |_   |  _  |___ ___   | __  |_ _ ___ ___|_|___ ___ 
  | | | -_|_'_|  _|  |     | . | . |  |    -| | |   |   | |   | . |
  |_| |___|_,_|_|    |__|__|  _|  _|  |__|__|___|_|_|_|_|_|_|_|_  |
                           |_| |_|                            |___|

\n listening on ${port}\n ` ));
