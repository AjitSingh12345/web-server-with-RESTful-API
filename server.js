if (process.env.NODE_ENV !== 'production')  {
    require('dotenv').config()
}     // set by node itself eltting you know what environment you are on (development or production?)

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey, stripePublicKey)

// express make manual operations much earier than generic node based server
const express = require('express')
const app = express() 

app.set('view engine', 'ejs')
app.use(express.static('public'))      // marks all files in public folder as static, making them available on the frontend

app.listen(3000)