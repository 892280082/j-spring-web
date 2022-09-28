import { ControllerBeanProcessor,ExpressAppEnhanceBeanProcessor,SpringParamterBeanPostProcessor } from "./springMvcBeanProcessor";
import { SpringMvcStarter } from './springMvcContainer'
import { SpringMvcExceptionHandlerConfigration } from './springMvcConfiguration'

export { SpringMvcExceptionHandler,SpringMvcParamInteceptor,isSpringMvcParamInteceptor } from './springMvcExtends'
export * from './springMvcConfiguration'
export * from './springMvcAnnotation'



/**
 * SpringMvcStarter web启动器
 * ExpressAppEnhanceBeanProcessor ExpressConfiguration的后置处理器
 * ControllerBeanProcessor controller的后置处理器
 */
export const SpringMvcModule = [
    SpringMvcStarter,
    ExpressAppEnhanceBeanProcessor,
    ControllerBeanProcessor,
    SpringParamterBeanPostProcessor,
    SpringMvcExceptionHandlerConfigration];