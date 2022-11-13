
const http = require('http');
const {Sequelize,DataTypes} = require("sequelize");

const app = require("./server");

const server = http.createServer(app);
const {API_PORT} = process.env;
console.log({API_PORT});
const port = process.env.PORT || API_PORT;

const sequelize = new Sequelize(
    'local_nodedb',
    'root',
    '',
    {
        host: 'localhost',
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
        allowNull:false
    },
});
sequelize.sync().then(()=>{
    console.log("Users tablie create successfully!");

    server.listen(port,()=>{
        console.log(`Server running port->${port}`)
    });

}).catch(()=>{
    console.log("Users tablie create failed!")
});
// module.exports = UserSchema;
