const adminAuth = (req,res,next)=>{
    console.log("Admin auth is checking");
    const token = "xyz";
    if(token !== "xyz"){
        res.status(401).send("Unauthorized!!");
    }
    next();
}


const userAuth = (req, res, next) => {
    console.log("User auth is checking");
    const token = "abc";
    if(token !== "abc"){
        res.status(401).send("Unauthorized!!");
    }
    next();
    
}

module.exports = {adminAuth, userAuth};