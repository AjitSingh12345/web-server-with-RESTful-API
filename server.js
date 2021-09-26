if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}     // set by node itself eltting you know what environment you are on (development or production?)

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey, stripePublicKey)

// express make manual operations much earier than generic node based server
const express = require('express')
const app = express() 
const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))      // marks all files in public folder as static, making them available on the frontend

app.get('/store', function(req, res) {
    fs.readFile('items.json', function(error, data) {
       if (error) {
           res.status(500).end()
       } else {
           res.render('store.ejs', {
               stripePublicKey: stripePublicKey,    // sends from server to ejs file as a javascript variable so we can acces inside our clientside
               items: JSON.parse(data)
           })
       }
    })
})

app.post('/purchase', function(req, res) {
    fs.readFile('items.json', function(error, data) {
       if (error) {
           res.status(500).end()
       } else {
           const itemsJson = JSON.parse(data)
           const itemsArray = itemsJson.Products.concat(itemsJson.Clothes)
           let total = 0
           req.body.items.forEach(function(item) {
               const itemJson = itemsArray.find(function(i) {
                   return i.id == item.id
               })    
               total = total + itemJson.price * item.quantity
           })

           stripe.charges.create({
               amount: total,
               source: req.body.stripeTokenId,
               currency: 'usd'
           }).then(function() {
               console.log('Charge Successful')
               res.json({ message: 'Successfully purchased items' })
           }).catch(function() {
               console.log('Charge Fail')
               res.status(500).end()
           })
       }
    })
})

app.listen(3000)