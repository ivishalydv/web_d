var express=require("express");
var router=express.Router({mergeParams:true});
var User=require("../models/user");
var Order=require("../models/order");
var Info=require("../models/info");
var methodOverride=require("method-override");
var flash=require("connect-flash");

router.use(flash());


//Basic Restaurant Routes
router.get('/',(req,res)=>
{
    res.render("index");
    console.log("homepage logged");
});

router.get('/about',(req,res)=>
{
    res.render("about");
    console.log("About section logged");
});

router.get('/gallery',(req,res)=>
{
    res.render("gallery");
    console.log("Gallery logged");
});

//=======================================
//Order adding routes

router.get('/menu',isLoggedIn,(req,res)=>{
    res.render("menu");
    console.log("Menu logged");
});

router.post('/menu',isLoggedIn,(req,res)=>{
    req.body.order.value=1;
    Order.create(req.body.order,(err,newOrder)=>{
        if(err){
            res.render("/");
            console.log(err);
        }else{
            req.user.orders.push(newOrder);
            req.user.save();
            res.redirect("menu");
        }
    });
});

//========================================


router.get('/cart',isLoggedIn,(req,res)=>{
            Order.find({'_id': {$in:req.user.orders}},(err,food)=>{
                if(err){
                   console.log(err);
                }
                else{
                    res.render("order_online",{foods:food}); 
                }
            })
        }); 

//========================================

router.get('/order',isLoggedIn,(req,res)=>{
    Order.find({'_id': {$in:req.user.orders}},(err,food)=>{
        if(err){
           console.log(err);
        }
        else{
            res.render("order",{foods:food});
        }
    })
});

router.post("/order",isLoggedIn,(req,res)=>{
    console.log(req.body.info);
    Info.create(req.body.info,(err,newOrder)=>{
        if(err){
            res.render('order');
        }else{
            res.render("order_placed",{Person:newOrder});
        }
    });
})



//========================================


router.get('/thankyou',isLoggedIn,(req,res)=>{
    res.render("order_placed");
    console.log("Thank you");
});

//=========================================

router.get('/feedback',isLoggedIn,(req,res)=>{
    res.render("feedback");
    console.log("Thank you for your feedback");
});



//=========================================

router.delete("/cart",(req,res)=>{
    Order.findByIdAndRemove(req.body.food.id,(err,removedItem)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/cart");
        }
    })
});
//=========================================

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","Please log in first");
        res.redirect("/login");
    }
};


module.exports=router;