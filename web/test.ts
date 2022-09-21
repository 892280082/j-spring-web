
import {springMvc} from '../src'
import { IndexController } from "./controller/IndexController";

//需要索引的类
const controllerClassList = [
    IndexController
]

springMvc.controller(controllerClassList).loadYaml('./web.yaml').start();






























// import express from "express";
// import path from "path";
// const app = express();
// const port = 3000; // default port to listen



// // Configure Express to use EJS
// app.set( "views", path.join( __dirname, "views" ) );
// app.set( "view engine", "ejs" );

// // define a route handler for the default home page
// app.get( "/", ( _req, res ) => {
//     // render the index template
//     res.render( "index" );
// } );


// app.get("/a",(req,res)=>{

//     res.json({'msg':'hello world'})
// })

// // // start the express server
// app.listen( port, () => {
//     // tslint:disable-next-line:no-console
//     console.log( `server started at http://localhost:${ port }` );
// } );