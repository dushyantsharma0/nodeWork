require('dotenv').config()
const mongoose= require('mongoose')
mongoose.connect(process.env.MONGODB_URl)
const express = require('express')
const cors=require('cors')


const app = express()
app.use(cors())
app.use(express.urlencoded({extended:false}))

app.use(express.json())

const routes =require('./routers/userRouter')

app.use('/',routes)


app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})