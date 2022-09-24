import { ControllerBeanProcessor,ExpressAppEnhanceBeanProcessor,SpringParamterBeanPostProcessor } from "./springMvcBeanProcessor";
import { SpringMvcStarter } from './springMvcContainer'


export * from './springMvcConfiguration'
export * from './springMvcAnnotation'


/**
 * SpringMvcStarter web启动器
 * ExpressAppEnhanceBeanProcessor ExpressConfiguration的后置处理器
 * ControllerBeanProcessor controller的后置处理器
 */
export const SpringMvcModule = [SpringMvcStarter,ExpressAppEnhanceBeanProcessor,ControllerBeanProcessor,SpringParamterBeanPostProcessor];