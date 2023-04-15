const express = require("express");
const app = express();
const path = require ('path');
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");



app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
var jsonParser = bodyParser.json({limit:1024*1024*10, type:'application/json'}); 
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*10,type:'application/x-www-form-urlencoded' });
app.use(jsonParser);
app.use(urlencodedParser);



    


const db = mysql.createPool({
    host: "localhost",
    user:"root",
    password:"Kishwari@123",
    database:"crud_contact"
});




app.get("/register", (req, res) => {
    const sqlGet = "SELECT * FROM users";
    db.query(sqlGet, (error, result)=>{
        res.send(result);
    });
});

app.get("/contact", (req, res) => {
    const sqlGet = "SELECT * FROM contact";
    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});



app.post('/register', (req, res) => {
    const name  = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const password = req.body.password;

    db.query("INSERT INTO users ( name,email,contact, password ) VALUES (?,?,?,?)",
     [name,email,contact, password], (error, result) => {
            console.log(error);
        }
    );
});



app.post('/login', (req,res)=>{
    const name = req.body.name;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE name = ? AND password = ?",
        [name, password],
        (err, result) => {
            if(err) {
                res.send({err:err});
            }
            if(result.length>0){
                res.send(result);
            }else{
                res.send({message: "Wrong username / password!"});
            }
        }
    );
});

app.post("/api/send-email", async (req, res) => {
    const { name,email, number, message } = req.body;
  
    try {
      // create a transporter object using SMTP transport
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "kishwarijit@gmail.com",
          pass: "pjmczqmkxowwzdfo",
        },
      });
  
      // send mail with defined transport object
      await transporter.sendMail({
        from:email ,
        to: "kishwarijit@gmail.com",
        text: message ,
         number,
         name,
       
      });
  
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });


app.get("/", (req, res) => {
  //  const sqlInsert = 
   // "INSERT INTO contact_db (name, email, contact) VALUES ('john doe', 'johndoe@gmail.com', 4546576776)";
 //   db.query(sqlInsert, (error, result) => {
     //   console.log("error", error);
      //  console.log("result", result);
      //  res.send("Hello Express");
   // });
    
});





app.listen(5001, () => {
    console.log("Server is running on port 5001");
})