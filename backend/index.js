const express = require('express');
const db = require('./db/config');
const cors = require("cors");
const User = require('./db/User');
const Product = require('./db/Product');

const Jwt = require('jsonwebtoken');
const jwtKey='e-comm';

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.post("/register", async (req,resp)=>{
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
        if(err){
            resp.send({result:"something went wrong,Please try after sometimes"})
        }
            resp.send({result,auth: token})
    }) 
    
});

app.post("/login",async (req,resp)=>{
    console.log(req.body)
    if(req.body.password && req.body.email)
    {
        let user = await User.findOne(req.body).select("-password");
        if(user){
            Jwt.sign({user},jwtKey,{expiresIn: "2h" },(err,token)=>{
                if(err){
                    resp.send({result:"something went wrong,Please try after sometimes"})
                }
                resp.send({user,auth: token})
            }) 
        }else{
            resp.send({result:'No User Found'})
        }
    }else{
        resp.send({result:'No User Found'})
    }
});

app.post("/add-product", async (req,resp)=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result)
});

app.get("/products",async (req,resp)=>{
    let products = await Product.find();
    if(products.length>0){
        resp.send(products)
    }else{
        resp.send({result:"No Products Found"})
    }
});

app.delete("/product/:id", async (req,resp)=>{
    const result = await Product.deleteOne({_id:req.params.id})
    resp.send(result);
});

app.get("/product/:id",async(req,resp)=>{
    let result = await Product.findOne({_id:req.params.id});
    if(result){
        resp.send(result)
    }else{
        resp.send({result: "No record Found"})
    }
})

app.put("/product/:id",async(req,resp)=>{
    let result = await Product.updateOne(
        {_id: req.params.id },
        {
            $set : req.body
        }
    )
    resp.send(result)
})

app.get("/search/:key",async(req,resp)=>{
    let result = await Product.find({
        "$or":[
            {name:{$regex:req.params.key}},
            {company:{$regex:req.params.key}},
            {category:{$regex:req.params.key}}
        ]
    });
    resp.send(result)
})

app.listen(port, () => console.log(`E-commerce is listening on port ${port}!`))
db();
