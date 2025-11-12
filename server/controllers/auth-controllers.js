const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const home = async (req, res) => {
   
    try{
        res
         .status(200)
         .send("welocome to world best mern series by thapa techical using router ");

    } catch (error){
        console.log(error);
    }
};

const register = async(req, res)=>{
    try{
       console.log(req.body);
       const { username, email, phone, password } = req.body;
       
       const userExist = await User.findOne({email});

       if(userExist){
        return res.status(400).json({msg: "email aleardy present"});
       }
       
       //hash password
    //    const saltRound =10;
    //    const hash_password = await bcrypt.hash(password, saltRound);

      const usercreated = await User.create({ 
        username, 
        email, 
        phone, 
        password,
     });

       res
       .status(200)
       .json({ msg: usercreated, 
        token: await usercreated.generateToken(), 
        userId: usercreated._id.toString(),
     });

    } catch(error) {
        res.status(400).json("internal server error")
    }
}

// user login

const login = async (req, res) =>{
    try{
     const { email, password} = req.body;

     const userExist = await User.findOne({email});
     console.log(userExist);

     if(!userExist){
        return res.status(400).json({ message: "Invalid user"});
     }
    
    //  const user = await bcrypt.compare(password,userExist.password);
     const user = await userExist.comparePassword(password);

     if(user){
        res.status(200).json({
            msg:"login successful",
            token : await userExist.generateToken(),
            userId: userExist._id.toString(),
        });
    
     }else{
        res.status(401).json({message: "Invalid email or password"});
     }
    }catch(error){
        //res.status(500).json("internal server error");
        next(error);
    }
};

module.exports = { home,register,login};