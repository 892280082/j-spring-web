import { BeanDefine, BeanPostProcessor, Component } from "j-spring";
import { Controller } from "./springMvcAnnotation";
import {ExpressLoad,isExpressConfiguration,ControllerBeanConfiguration} from './springMvcBeans'

//解析的bean集合
const configureBeanList = new Set<ExpressLoad>();

//运行结束时清空
export const loadConfiguration = (app:any)=>{
    configureBeanList.forEach(config => config.load(app));
    configureBeanList.clear();
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

        if(isExpressConfiguration(bean)){
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
                configureBeanList.add(new ControllerBeanConfiguration(bean,beanDefine))
        }

        return bean;
        
    }

}