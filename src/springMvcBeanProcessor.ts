import { Autowired, BeanDefine, BeanPostProcessor, Component } from "j-spring";
import { Controller } from "./springMvcAnnotation";
import {ControllerBeanConfiguration,paramInterceptor} from './springMvcRouterDelegate'
import { ExpressLoad,isExpressConfiguration,SpringMvcExceptionHandler,isSpringMvcExceptionHandler} from './springMvcExtends'
import { SpringMvcExceptionHandlerConfigration } from './springMvcConfiguration'
import {isSpringMvcParamInteceptor} from './springMvcExtends'

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


    @Autowired({type:isSpringMvcExceptionHandler,force:false})
    exceptionHanlder:SpringMvcExceptionHandler = new SpringMvcExceptionHandlerConfigration();

    getSort(): number {
        return 100;
    }

    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
        return bean;
    }


    postProcessAfterInitialization(bean: any, beanDefine: BeanDefine): Object{

        if(beanDefine.hasAnnotation(Controller)){
                configureBeanList.add(new ControllerBeanConfiguration(bean,beanDefine,()=>this.exceptionHanlder))
        }

        return bean;
        
    }

}

/**
 * 用于设置express router中参数的处理器
*/
@Component
export class SpringParamterBeanPostProcessor implements BeanPostProcessor {
    getSort(): number {
        return 100;
    }
    postProcessBeforeInitialization(bean: any, _beanDefine: BeanDefine): Object {
        return bean;
    }
    postProcessAfterInitialization(bean: any, _beanDefine: BeanDefine): Object {
        if(isSpringMvcParamInteceptor(bean)){
            paramInterceptor.push(bean);
        }
        return bean;
    }
}

