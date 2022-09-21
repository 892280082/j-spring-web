import express from "express";
import { Component, Value } from "j-spring";
import {addConfiguration} from './springMvcBeanProcessor'

@Component
export class SpringMvcApplication {

    @Value({path:'j-spring.port',type:Number,force:false})
    port = 3000;

    startExpressApp(){
        const app = express();
        addConfiguration(app);
        app.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log( `server started at http://localhost:${ this.port }` );
        });
    }

    main(){

        this.startExpressApp();

    }

}
