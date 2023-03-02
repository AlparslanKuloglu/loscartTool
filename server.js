
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Kullanici = require('./models/kullanici')
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path=require('path')



const app = express();
const server = http.createServer(app);
const io = socketio(server)
const formatMessage = require("./utils/messages");

require("dotenv").config();
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");


app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect('mongodb+srv://alparslank:12101210@cluster0.wfcgv.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});






//Middlewares

app.use(
  session({
    secret: 'klg1210',
    saveUninitialized: true,
    resave: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://alparslank:12101210@cluster0.wfcgv.mongodb.net/test' }),
  })
);




const userRoute = require('./routes/userRoute')
app.use('/user',userRoute)













const botName = "Loscart Asistan";

const sorular = ["Kaç yaşındasın?","Cinsiyetin nedir?","Senin için fiyat mı önemli yoksa kalite mi?",
"Rahatlığa mı önem verirsin şıklığa mı?"

]



let sira = -1

io.on("connection", async (socket) => {



  socket.on("joinRoom",  async ({ username, room }) =>  {
    const user = userJoin(socket.id, username, room);
    var kullanici = await Kullanici.findById(user.username)
    console.log(kullanici)

    socket.join(user.room);



 if(kullanici.soru===0){

  socket.emit("message", formatMessage(botName, `Merhaba ${kullanici.name}, Ben Loscart web asistan,sana birkaç sorum var izninle sorabilir miyim?`));

 }

 if(kullanici.soru===4){
  
  socket.emit("message", formatMessage(botName, `Cevapların sayesinde seni artık iyi tanıyorum.Teşekkür ederim :)`));

 }

 if(! (kullanici.soru===4 || kullanici.soru===0 )){
  
  socket.emit("message", formatMessage(botName, `Geçen konuşuyorduk ama yarım kalmıştı.Seni tanımaya devam edebilir miyim? :)`));

 }




 
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });


  socket.on("chatMessage", async (msg) => {


   

      const user = getCurrentUser(socket.id);



      io.to(user.room).emit("message", formatMessage(user.username, msg));

      var kullanici = await Kullanici.findById(user.username)

      if (! (kullanici.soru===4 ) ) {
        console.log(msg)
  
        if(! (kullanici.soru===4) ){
    
          socket.emit("message", formatMessage(botName, sorular[kullanici.soru]));
    
        }
      
    
      
    
        if(kullanici.soru===4){
      
          socket.emit("message", formatMessage(botName, `Merak ettiklerim bunlardı.Teşekkür ederim :)`));
        
         }
    
         kullanici.soru += 1
         kullanici.save()
        

      
    }
  
     
  



  });


  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {


    
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
