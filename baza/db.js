const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt2018", "root", "root",
{
    host: "localhost",
    dialect: "mysql",
    logging: false
});

const db={};    

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.godina = sequelize.import(__dirname + '/godina.js');
db.student = sequelize.import(__dirname + '/student.js');
db.vjezba = sequelize.import(__dirname + '/vjezba.js');
db.zadatak = sequelize.import(__dirname + '/zadatak.js');

//relacije
//vise studenata moze biti na jednog godini 
db.godina.hasMany(db.student, {as : 'studenti', foreignKey : 'studentGod'});

// Veza n-m 
//godina -- više na više -- vjezba, mt godina_vjezba, fk idgodina i idvjezba, as godine i vjezbe
db.godina_vjezba = db.godina.belongsToMany(db.vjezba, {as:'vjezbe', through:'godina_vjezba', foreignKey:'idgodina'});
db.godina_vjezba = db.vjezba.belongsToMany(db.godina, {as:'godine', through:'godina_vjezba', foreignKey:'idvjezba'});

//vjezba -- više na više -- zadatak, mt vjezba_zadatak, fk idvjezba i idzadatak, as vjezbe i zadaci
db.vjezba_zadatak = db.vjezba.belongsToMany(db.zadatak, {as:'zadaci', through:'vjezba_zadatak', foreignKey:'idvjezba'});
db.vjezba_zadatak = db.zadatak.belongsToMany(db.vjezba, {as:'vjezbe', through:'vjezba_zadatak', foreignKey:'idzadatak'});

module.exports=db;