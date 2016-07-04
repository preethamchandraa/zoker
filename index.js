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

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
			let myjson = '[{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Flat Rs.500 Off On Minimum Purchase Of On Rs.2000","image_url":"https://upload.wikimedia.org/wikipedia/en/2/2b/Logo_of_Jabong.png","subtitle":"This Coupon gives you Flat Rs.500 Off on Minimum Purchase OfRs.2000","buttons":{"type":"web_url","title":"ICICV500JG","url":"http://www.jabong.com/all-products/?promotion=additional-30"}},{"title":"Extra 10% OFF on Clothing \u0026 Footwear for Women (6PM-12PM)","image_url":"https://upload.wikimedia.org/wikipedia/en/2/2b/Logo_of_Jabong.png","subtitle":"This Coupon gives you Extra 10% OFF on Clothing \u0026 Footwear for Women (6PM-12PM)","buttons":{"type":"web_url","title":"EXTRA10","url":"http://www.jabong.com"}},{"title":"Flat 30% OFF on purchase of products worth Rs 1699","image_url":"https://upload.wikimedia.org/wikipedia/en/2/2b/Logo_of_Jabong.png","subtitle":"This Coupon gives you Flat 30% OFF on purchase of products worth Rs 1699","buttons":{"type":"web_url","title":"EXTRA30","url":"http://www.jabong.com"}},{"title":"Flat 20% OFF on purchase of products worth Rs 1699","image_url":"https://upload.wikimedia.org/wikipedia/en/2/2b/Logo_of_Jabong.png","subtitle":"This Coupon gives you Flat 20% OFF on purchase of products worth Rs 1699","buttons":{"type":"web_url","title":"ACC20","url":"http://www.jabong.com"}}]}}}]'
            if (text === 'Generic') {
                sendNewMessage(sender, myjson)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
    let messageData = { text:text }
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

function sendNewMessage(sender, messageData) {
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

function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
		"type": "template",
		"payload": {
			"template_type": "generic",
			"elements": [{
				"title": "Flat Rs.500 Off On Minimum Purchase Of On Rs.2000",
				"image_url": "https://upload.wikimedia.org/wikipedia/en/2/2b/Logo_of_Jabong.png",
				"subtitle": "This Coupon gives you Flat Rs.500 Off on Minimum Purchase OfRs.2000",
				"buttons": [{
					"type": "web_url",
					"title": "ICICV500JG",
					"url": "http://www.jabong.com/all-products/?promotion=additional-30"
				}]
			},
			{
				"title": "Extra 10% OFF on Clothing \u0026 Footwear for Women (6PM-12PM)",
				"image_url": "https://upload.wikimedia.org/wikipedia/en/2/2b/Logo_of_Jabong.png",
				"subtitle": "This Coupon gives you Extra 10% OFF on Clothing \u0026 Footwear for Women (6PM-12PM)",
				"buttons":[ {
					"type": "web_url",
					"title": "EXTRA10",
					"url": "http://www.jabong.com"
				}]
			},
			{
				"title": "Flat 30% OFF on purchase of products worth Rs 1699",
				"image_url": "https://upload.wikimedia.org/wikipedia/en/2/2b/Logo_of_Jabong.png",
				"subtitle": "This Coupon gives you Flat 30% OFF on purchase of products worth Rs 1699",
				"buttons": [{
					"type": "web_url",
					"title": "EXTRA30",
					"url": "http://www.jabong.com"
				}]
			}
			]
		}
		}
    }
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
//683820604

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})