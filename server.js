const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const socket = require('socket.io')
const cors = require('cors')
const e = require('express')
const io = socket(server,{
  cors:{
    origin: "*",
    methods: ["GET", 'POST']
  }
})

let foods = {
  a: "Rice",
  b: "Amala",
  c: "beef",
  d: "Custard and Akara"
}

let currentOrder =[]

io.on('connection', (socket)=>{

  socket.emit('welcome-msg', {
    a : `Select 1 to place an order,\n
      Select 99 to checkout order,\n
    Select 98 to see order history,\n
    Select 97 to see current order,\n
    Select 0 to cancel order\n`
})

    //message event
    socket.on('message', (msg)=>{
      //list of available meals
      if(msg == 1){
        const items = Object.keys(foods)
        .map((key)=> `${key}: ${foods[key]}`)
        .join("\n")
        socket.emit('response', `Available items.\n ${items}.\n Select an option`)
      }else if(Object.keys(foods).includes(msg)){
        //ordering a meal
        currentOrder.push(foods[msg])
        console.log(currentOrder)
        socket.emit('response', `Your selected option ${foods[msg]} has been added to your orders. You can select more options or select 99 to checkout.`)
      }else if(msg == 99){
        //placing the order / checkout
        if(currentOrder.length === 0){
          socket.emit('response', `No current order. Try ordering a meal.`)
        }else if(currentOrder.length){
           socket.emit('response', "Order placed")
        currentOrder = []
        }
      }else if(msg == 97){
        //getting current order
        if(currentOrder.length == 0){
          socket.emit('response', `No current order. Try ordering a meal.`)
        }else if(currentOrder){
          const currentOrderString = currentOrder.join(", ");
          socket.emit('response', `Here is your current order: \n${currentOrderString}`)
        }
        
      }else if(msg == 0){
        if(currentOrder.length === 0){
          socket.emit('response', `You haven't placed an order yet.`)
      }else if(currentOrder){ 
        socket.emit('response', `Your order of ${currentOrder.join(", ")} has been cancelled.`)
        currentOrder = []
      }
       
      }else{
        socket.emit("response", "Invalid Command!!")
        socket.emit('welcome-msg', {
          a : `Select 1 to place an order,\n
            Select 99 to checkout order,\n
          Select 98 to see order history,\n
          Select 97 to see current order,\n
          Select 0 to cancel order\n`
      })
      }

    })
})



server.listen(5050, ()=>{
    console.log(`CONNECTED now`)
})