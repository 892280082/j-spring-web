import { BeanDefine, BeanPostProcessor, Component } from "j-spring";
import { Controller } from "./springMvcAnnotation";


//解析的bean集合
const configureBeanList = new Set<ExpressLoad>();

//运行结束时清空
export const addConfiguration = (app:any)=>{
    configureBeanList.forEach(config => config.load(app));
    configureBeanList.clear();
}

export interface ExpressLoad {
    load(app:any):void;
}

const ExpressConfigurationSymbok = Symbol('ExpressConfiguration');

//express App 配置
export abstract class ExpressConfiguration implements ExpressLoad {
    abstract load(app: any):void;
    ExpressConfigurationSymbok:Symbol=ExpressConfigurationSymbok;
}

//controller配置
class ControllerBeanConfiguration implements ExpressLoad {
    //加载express app
    load(_app: any): void {
        
    }
}

/**
 * 用于设置express的配置
 * 
 */
@Component
export class ExpressAppEnhanceBeanProcessor implements BeanPostProcessor {

    getSort(): number {
        return 99;
    }

    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
        return bean;
    }


    postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine): Object {

        if((bean as ExpressConfiguration).ExpressConfigurationSymbok == ExpressConfigurationSymbok){
            configureBeanList.add(bean);
        }

        return bean;
        
    }

}


/**
 * 用于设置express的路由
 */
 @Component
export class ControllerBeanProcessor implements BeanPostProcessor {

    getSort(): number {
        return 100;
    }

    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
        return bean;
    }


    postProcessAfterInitialization(bean: any, beanDefine: BeanDefine): Object{

        if(beanDefine.hasAnnotation(Controller)){
                configureBeanList.add(new ControllerBeanConfiguration())
        }

        return bean;
        
    }

}