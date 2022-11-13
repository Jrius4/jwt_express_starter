const Sequelize = require("sequelize");


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

