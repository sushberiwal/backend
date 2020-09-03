// npm init -y
// npm install express
// npm install nodemon
// apis ? => Restaurant( Database ) => Paneer Tika( Data ) => waiter( API ) => Restaurant kitchen me jaega
// or dish( data ) leke aayega  
// local server bna dia 
// Backend likhne me kaam aata hai
// Node pe ek layer hai abstraction ki
const express = require("express");
const app = express();
const fs = require("fs");
const {v4:uuidv4} = require("uuid");
let users = require("./db/users");
// json data request ki body me ata hai usko load karne ke liye
app.use(express.json());
//CRUD => create user, read user , update user , delete user
// server => post request with url localhost:3000/user
const createUser = (req , res)=>{
    console.log(req.body);
    req.body.uid = uuidv4();
    users.push(req.body);

    fs.writeFileSync("./db/users.json" , JSON.stringify(users));
    res.status(201).json({
        "message":"User created Successfully",
        "data" : req.body
    })
}
const getAllUsers =(req , res)=>{
    res.status(201).json({
        "message":"Sucessfuly get all users",
        "data":users.length == 0 ? "No User Found": users
    }
    )
} 
const updateUser = (req , res)=>{
    let uid = req.params.uid;
    //even if we get one result filter always gives
    // an array so objects is an array
    // so the object we want is on 0th index
    let objects =  users.filter( (obj) => {
         return obj.uid == uid;
     });

     if(objects.length == 0 ){
         res.status(201).json({
             "Message":"No user found !!"
         })
     }
     else{
         let obj = objects[0];
       //   console.log(obj);  
         for(key in req.body){
             obj[key] = req.body[key];
         }        
       //   console.log(obj);
       fs.writeFileSync("./db/users.json" , JSON.stringify(users));
       res.status(201).json({
           "Message":"User updated Succesully !",
           "Data":obj
       })
     }
     
}
const deleteUser = (req,res)=>{
    let uid = req.params.uid;
    console.log(uid);
    
    let idx = -1;
    for(let i=0 ; i<users.length ; i++){
        if(users[i].uid == uid){
            idx = i;
            break;
        }
    }
    if(idx==-1){
        res.status(201).json({
            "Message":"There is no user"
        })
    }
    else{
        let deletedObj = users.splice(idx , 1);
        // console.log(users);
        fs.writeFileSync("./db/users.json" , JSON.stringify(users));
        res.status(201).json({
            "Message":"User deleted successfully",
            "Deleted":deletedObj
        })
    }
}
// create user
app.post("/user" , createUser);
// get all users
app.get("/user" , getAllUsers);
// update user
app.patch("/user/:uid" , updateUser);
//delete user
app.delete("/user/:uid" , deleteUser);
app.listen(3000 , ()=>{
    console.log("Your server is active on 3000 localhost");
})


