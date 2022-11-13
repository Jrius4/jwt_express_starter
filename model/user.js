const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");


sequelize.define("users",{
   
    "name":{
        type:DataTypes.STRING,
        allowNull:false
    },
    "email":{
        type:DataTypes.STRING,
        allowNull:false
    },
    "password":{
        type:DataTypes.STRING,
        allowNull:false
    },
    "token":{
        type:DataTypes.STRING,
        allowNull:true,
        default:"token"
    },
});
sequelize.sync().then(()=>{
    console.log("Users tablie create successfully!")
}).catch(()=>{
    console.log("Users tablie create failed!")
});
// module.exports = UserSchema;
