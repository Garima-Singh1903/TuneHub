import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import songRouter from './src/routes/songRoute.js';
import connectDB from './src/config/mongodb.js';
import connectCloudinary from './src/config/cloudinary.js';
import albumRouter from './src/routes/albumRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();


// middlewares
app.use(express.json());//using this middleware whenever will get any request it will passed using json method
app.use(cors()); // when backend and frontend have diff port number cors will connect them

// initializing routes

app.use("/api/song",songRouter)
app.use("/api/album",albumRouter)

app.get('/',(req,res)=>res.send("API Working"))

app.listen(port,()=>console.log(`Server started on ${port}`))


