
const http = require('http');
const {Sequelize,DataTypes} = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const app = require("./server");

const server = http.createServer(app);
const {API_PORT} = process.env;
console.log({API_PORT});
const port = process.env.PORT || API_PORT;

const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: 'mysql'
    }
);

sequelize.authenticate().then(() => {
    console.log("connection has been establish");
}).catch((error) => {
    console.error("conn failed to connect");
});



const User = sequelize.define("users",{
    "name":{
        type:DataTypes.STRING,
        allowNull:false
    },
    "email":{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    "password":{
        type:DataTypes.STRING,
        allowNull:false
    },
    "token":{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:"default token"
    },
});
sequelize.sync().then(()=>{
    console.log("Users tablie create successfully!");

    server.listen(port,()=>{
        console.log(`Server running port->${port}`);
        app.post("/api/register",async (req,res)=>{
            try{

                const {name,email,password} = req.body;

                console.log({name,email,password});
                if(!(email && name && password)){
                    res.status(400).send("All input is required");
                }
                const oldUser = await User.findOne({where:{email}});
                console.log({oldUser});
                if(oldUser){
                    return res.status(409).send("User Already Exist. Please Login");
                }

              var encrytedPassword = await bcrypt.hash(password,10);

                const user = await User.create({
                    name,email,password:encrytedPassword
                });
                console.log({user});
                const token = jwt.sign(
                    {user_id:user.id,email},
                    process.env.TOKEN_KEY,
                    {
                        expiresIn:"2h",
                    }
                )

                console.log({token});

                user.token = token;
                user.save();

                res.status(201).json(user);

            }catch(err){
                console.error({err});
            }
        });

        app.post("/api/login",async (req,res)=>{
            try{
                const {email,password} = req.body;

                if(!(email && password)){
                    res.status(400).send("All input is required");
                
                }

                const user = await User.findOne({where:{email}});

                if(user && (await bcrypt.compare(password,user.password))){
                    const token = jwt.sign(
                        {user_id:user.id,email},
                        process.env.TOKEN_KEY,
                        {
                            expiresIn:"2h",
                        }
                    )
    
                    console.log({token});
    
                    user.token = token;
                    user.save(); 
                    res.status(200).json(user);
                }
                res.status(400).send("Invalid Credentails")
            }catch(err){
                console.error({err})
            }
        });
    });

}).catch(()=>{
    console.log("Users tablie create failed!")
});
// module.exports = UserSchema;
