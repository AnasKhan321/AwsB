
const express = require('express')
const app = express()
const port = 3000
const ConnectToMongo = require('./db')
const User = require('./User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Service = require('./Service'); 
const Student = require('./Student')
var cors = require('cors')

app.use(cors())
app.use(express.json())


ConnectToMongo();


app.get('/', (req, res) => {

    res.send('Hello World!')
})

// Authentication System 
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    let success = false;
    let user = await User.findOne({ email: email })
    if (user) {
        res.json({ success: success, error: "Your email is already Register Login or Register with other email " });

    }
    else if (password.length < 8) {
        res.json({ success: success, error: "Password Must Contain 8 letters " });
    }

    else {
        let salt = await bcrypt.genSaltSync(10);
        let hash = await bcrypt.hashSync(password, salt);
        const newUser = User.create({
            username: username,
            email: email,
            password: hash
        })
        const data = {
            user  : {
                id: newUser.id,
                email: newUser.email
            }
        }
        success = true;
        var token = jwt.sign(data, 'secret123');

        res.json({ success: success, token: token })
    }

})


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(email == 'admin@email.com' , password == 'admin123'){
        const data = {
            user  : {
                email: email 
            }
        }
      
        var token = jwt.sign(data, 'secret123');
        return res.json({ success: true, token: token  , admin : true})
    }
    let success = false;
    let user = await User.findOne({ email: email })
    if (user) {
        const passwordCompare = await bcrypt.compare(password, user.password)
        if(passwordCompare){
            const data = {
                user  : {
                    id: user.id,
                    email: user.email
                }
            }
            success = true;
            var token = jwt.sign(data, 'secret123');
            res.json({ success: success, token: token , admin : false })
        }

        else{
            res.json({success : success , error : "Invalid Email or Password "})
        }

    }
    else {
        res.json({ success: success, error: "No user Exsists with this email Id " })
    }

})



// Service Managment 

// Add the Service 
app.post('/addservice' , (req,res)=>{
    const {title , desc , price} = req.body ; 
    let newS = Service.create({
        title : title,
        desc : desc,
        price : price
    })

    res.json({success :true })
})

// All Services 
app.get('/allservices' , async(req,res)=>{
    const data =  await Service.find(); 
    res.json({data : data})
})

// Delete Service
app.get('/delete/:id' , async(req,res)=>{
    const d = await  Service.findByIdAndDelete(req.params.id); 
    res.json({success : true})
})

// Update Service 
app.post('/upateservice/:id' , async(req,res)=>{
    const ud = await Service.findByIdAndUpdate(req.params.id , req.body)
    res.json({success : true})
})

// Get service uniquely 
app.get('/byid/:id' , async(req,res)=>{
    const data = await  Service.findOne({_id : req.params.id})
    res.json({data : data})
})


// Take the Order and submit in the studnet 
app.post('/takeorder' , async(req,res)=>{
    const {token , listt} = req.body ; 
    console.log(token, typeof(listt))
    const  d  =  await jwt.verify(token ,'secret123' )
    const email = d.user.email
    console.log(email)
    console.log(d)
    listt.map((e)=>{
        let = Student.create({
            cid : e , 
            uemail : email
        })
    })
    res.json({success : true})
})

// fetch services for a specific user 
app.get('/mycourse/:id' , async(req,res)=>{
    console.log(req.params.id )
    const  d  =  await jwt.verify(req.params.id ,'secret123' )
    const email = d.user.email ; 
    const studentss = await Student.find({uemail : email}); 
    let sdata = []
    for (const e of studentss) {
        let ddd = await Service.findOne({ _id: e.cid });
        sdata = sdata.concat(ddd); // Update sdata with the concatenated array
        console.log(ddd);
      }
    console.log(sdata)

    res.json({data  : sdata})

})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})