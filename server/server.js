const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

//conifg 
dotenv.config({ path: 'server/config/config.env' });

connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});