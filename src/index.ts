import { Clazz, spring } from "j-spring";
import { ControllerBeanProcessor,ExpressAppEnhanceBeanProcessor } from "./springMvcBeanProcessor";
import { SpringMvcApplication } from './springMvcContainer'

export {ExpressConfiguration} from './springMvcBeanProcessor'
export { SpringMvcApplication } from './springMvcContainer'


class SpringMvcPanel {

    application:Clazz = SpringMvcApplication;

    constructor(){
        //后置处理器
        spring.bind(ExpressAppEnhanceBeanProcessor).bind(ControllerBeanProcessor);
    }

    controller(clazz:Clazz[]){
        clazz.forEach(spring.bind)
        return this;
    }

    loadConfig(data?:any){
        spring.loadConfig(data);
    }

    loadYaml(_filePath:string){
        return this;
    }

    //启动
    start(launchClazz?:Clazz){
        spring.launch(launchClazz||SpringMvcApplication)
    }

}

export const springMvc = new SpringMvcPanel();