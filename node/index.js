'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

app.use(express.static(__dirname + '/View'));
// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a Developer')
})

app.get('/admin',function(req,res){
//res.sendFile(__dirname +'/adminindex.html');
res.sendFile("adminindex.html", {"root": __dirname});
  //__dirname : It will resolve to your project folder.
});

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

//FaceBook Messenger - ChatBot - WebHook
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            sendTextMessage(sender, text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

// Get the Address Details from the LatLng details of the Customer.
app.get('/getreversegeocode/', function (req, res) {
var lat = -38.750;
var lon=150.950;

if(req.query.lat != null)
 lat = req.query.lat;

if(req.query.lon != null)
 lon = req.query.lon;

//Key to be masked and added in env vairable
  request({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon+'&key=AIzaSyAGVyPnzUphJcgYq7JnecDNsPfODGd-9cM',
      method: 'GET',

  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
      else {
      res.send(response.body);


      }

});
});


app.get('/optusResponse/', function (req, res) {
var lat = -38.750;
var lon=150.950;
if(req.query.lat != null)
 lat = req.query.lat;

if(req.query.lon != null)
 lon = req.query.lon;



  request({
      url: 'https://dartgeo.optuszoo.com.au/geo-service/geo/hotRate/'+lat+'/'+lon,
      method: 'GET',

  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
      else {
//Mocked up the data here. The core service resides here which would do the heavy lifting of talking to multiple API and mash up the response, To call the Google Places API to fetch near by attractions & business tagged to the organisation

      res.json([{"Subscription":"Restaurant","Name":"Sepia Restaurant","url":"https://www.sepiarestaurant.com.au/","Distance":"260.m","Address":"201,Sussex Street","HeatIndex":response.body.substring(8,response.body.length-1),"Current Status":"Active","PromotionCode":"OPTUS21RE4","ImageURL":"http://32nx081gxf2a22tnp739vhey.wpengine.netdna-cdn.com/wp-content/uploads/2014/09/image2.jpeg","PromoDesc":"Avail 20% off"},{"Subscription":"Bar","Name":"Baxter Inn","url":"https://www.baxterinn.com.au/","Distance":"240.m","Address":"152 Clarence St.","HeatIndex":response.body.substring(8,response.body.length-1),"Current Status":"Active","PromotionCode":"OPTUS21BR4","ImageURL":"https://img.zmtcdn.com/data/pictures/1/16558191/d24825996f0d060bd3be3b83206bbaf7.jpg","PromoDesc":"Avail 50% off"},{"Subscription":"Shopping","Name":"Westfield Shopping","url":"https://www.westfield.com.au/","Distance":"230.m","Address":"188,Pitt Street","HeatIndex":response.body.substring(8,response.body.length-1),"Current Status":"Active","PromotionCode":"OPTUS21SH4","ImageURL":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/New_Westfield_shopping_centre,_Sydney_CBD.jpg/1024px-New_Westfield_shopping_centre,_Sydney_CBD.jpg","PromoDesc":"Avail 20% off at David Jones"}]);


      }

});
});

//Key to be masked and added in env vairable
const token = "EAAYY42WhGn0BAOI7Bjp4UkHCREOu2RrZCtyoe4g8WGkdnlBZAcNUZBiBxRGwPrKCE2sQK0TLbKYZCu883bJeKb1JjXIR0Mp9HLa71fHPphm1X0wDTOaWHVqR5uzDKgRP11Dd8NNOvujw5lsoZBaX1fwLK8mLnAgnvywofcIW7ggZDZD"


function sendTextMessage(sender, text) {
// This method talks to the facebook messenger.
   let messageData = externalAPICall(sender,text)
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function externalAPICall(sender,text)
{
//This functionality is to be ideally replaced by cognitive analytical services. For the demo its been mocked up today.
  if (text.toLowerCase().indexOf("hello") > -1)
  {
    return { text:'Hello,how can i help you today' };
  }

  else if (text.toLowerCase().indexOf("crowded or") > -1)
  {

//NLP Get comparable object A and B

// Call Google api to get lat and log for location A and B

/*  url: 'https://dartgeo.optuszoo.com.au/geo-service/geo/hotRate/'+lat+'/'+lon, // for location A
  method: 'GET',

  url: 'https://dartgeo.optuszoo.com.au/geo-service/geo/hotRate/'+lat+'/'+lon, // for location B
    method: 'GET',

    Compare the current weight

return object with less Weight
*/

//Below is a sample response
    return { text:'Go for '+ text.substring(3, text.toLowerCase().indexOf("crowded or")) };
}

  else if ((text.toLowerCase().indexOf("quiet restaurant") > -1) || (text.toLowerCase().indexOf("not so crowded") > -1) || (text.toLowerCase().indexOf("less crowded") > -1) || (text.toLowerCase().indexOf("less people") > -1))
  {

    /*
    request({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=GEORGE+Street+Sydney+CBD&key=APIKEYHERE,
        method: 'GET',

    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
        else {

        request({
            url: 'http://dartgeo.optuszoo.com.au/geo-service/geo/',
            method: 'POST',
            json: {
            'latNW':-33.64,
            'lonNW':150.84,
            'latSE':-33.75,
            'lonSE':150.95,
            'minWeight':50,
            'outputSize':100,
            }

        }, function(error, response, body) {
            if (error) {
                console.log('Error sending messages: ', error)
            } else if (response.body.error) {
                console.log('Error: ', response.body.error)
            }
            else { */
         //  return  gettop5results(response.body);
       //    return  gettop5results("");
    /*
            }

      });

        }

    });

    */

    var messageData = {
      attachment: {
         type: "template",
         payload: {
           template_type: "generic",
           elements: [{
             title: "Sepia Restaurant",
             subtitle: "Upscale spot for carefully-presented Japanese-inspired dishes",
             item_url: "http://sepiarestaurant.com.au",
             image_url: "http://32nx081gxf2a22tnp739vhey.wpengine.netdna-cdn.com/wp-content/uploads/2014/09/image2.jpeg",
             buttons: [{
               type: "web_url",
               url: "http://opentable.com.au",
               title: "Reserve"
             }, {
               type: "postback",
               title: "Get Promocode",
               payload: "Promocode for first bubble",
             }],
           }, {
             title: "Jpb",
             subtitle: "Local ingredients, from lamb to olive oil",
             item_url: "opentable.com.au",
             image_url: "https://img.zmtcdn.com/data/pictures/1/16558191/d24825996f0d060bd3be3b83206bbaf7.jpg",
             buttons: [{
               type: "web_url",
               url: "http://jpbrestaurant.com.au",
               title: "Reserve"
             }, {
               type: "postback",
               title: "Get Promocode",
               payload: "Promocode for first bubble",
             }]
           }]
         }
       }
     };
    return messageData;




  }

}

function gettop5results(JsonResponses)
{

/*
// Parse response to get the lat long with least weightage (heatmap index)
// Call Google Places api with the retrived lat longitude
//pass the results.

*/


}

/*function externalAPICall(text)
{
        if (text.toLowerCase().indexOf("gate") > -1)
      return "Head to Gate M , boarding starts in 30 min";
  else  if (text.toLowerCase().indexOf("problem") > -1)
      return "We have raised a service request on your behalf";
  else  if (text.toLowerCase().indexOf("cheap flight") > -1)
      return "y not try for 3rd August";
  else  if (text.toLowerCase().indexOf("hi") > -1)
      return "Hello , how are you";
  else  if (text.toLowerCase().indexOf("good") > -1)
      return "So how could i help you ?";
  else  if (text.toLowerCase().indexOf("fine") > -1)
      return "So how could i help you ?";
  else  if (text.toLowerCase().indexOf("delay") > -1)
      return "No worries , your flight is on-time , Get set and relax ! ";
  else  if (text.toLowerCase().indexOf("beach") > -1)
      return "Wanna try Gold coast , for a better deal";
  else  if (text.toLowerCase().indexOf("yes") > -1)
          return "Well am still in beta, not sure what to answer :)";
  else  if (text.toLowerCase().indexOf("who r u") > -1)
          return "Ask my boss !!";
  else  if (text.toLowerCase().indexOf("how r u") > -1)
          return "Am awesome.. thanks!!";
  else  if (text.toLowerCase().indexOf("checkin for me") > -1)
          return "Do you have a seat preference";
  else  if (text.toLowerCase().indexOf("window") > -1)
          return "got a seat 10C blocked for you...";
  else  if (text.toLowerCase().indexOf("window") > -1)
          return "got a seat 10A blocked for you...sit back and enjoy the view";
  else  if (text.toLowerCase().indexOf("extra leg") > -1)
          return "got a seat 12A blocked for you...its an emergency exit by the way";
  else
          return "Well am still in beta, not sure what to answer :)";


}*/
