const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("../airbnb/models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const engine = require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

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

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);   
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

app.get("/listings", validateListing,wrapAsync(async(req,res)=>{
const allListing=await Listing.find({});
res.render("../listings/index.ejs",{allListing})
}))

app.get("/listings/new",(req,res)=>{
    res.render("../listings/new.ejs")
})
// Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
let{id}=req.params;
 const listing=await Listing.findById(id);
 res.render("../listings/show.ejs",{listing});
}))

// create route
app.post("/listings",wrapAsync(async (req,res)=>{ 
    let newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
})
); 

// Edit route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
let{id}=req.params;
 const listing=await Listing.findById(id);
 res.render("../listings/edit.ejs",{listing})
}))

app.put("/listings/:id", validateListing,wrapAsync(async (req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);    
}))

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})
)


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

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!")) ;
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080,(req,res)=>{
    console.log("app is listening on port 8080")
})