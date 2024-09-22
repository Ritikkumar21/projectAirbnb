const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../airbnb/models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const engine = require('ejs-mate');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
.then((res)=>{
    console.log("Connected to DB");
})
.catch((err)=>{
console.log(err)
});

async function main() {
  await mongoose.connect(MONGO_URL);

}

app.get("/",(req,res)=>{
res.send("I am root!");
})

app.get("/listings",async(req,res)=>{
const allListing=await Listing.find({});
res.render("../listings/index.ejs",{allListing})
})

app.get("/listings/new",(req,res)=>{
    res.render("../listings/new.ejs")
})
// Show Route
app.get("/listings/:id",async(req,res)=>{
let{id}=req.params;
 const listing=await Listing.findById(id);
 res.render("../listings/show.ejs",{listing});
})

app.post("/listings",async (req,res)=>{
    let newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
// Edit route
app.get("/listings/:id/edit",async(req,res)=>{
let{id}=req.params;
 const listing=await Listing.findById(id);
 res.render("../listings/edit.ejs",{listing})
})

app.put("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})

// app.get("/testListing",async(req,res)=>{
// let sampleListing=new Listing({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"Calangute,Goa",
//     country:"India",
// })
// await sampleListing.save();
// console.log("Sample was saved");
// res.send("Successful Testing")
// })

app.listen(8080,(req,res)=>{
    console.log("app is listening on port 8080")
})