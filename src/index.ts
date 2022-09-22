import { ControllerBeanProcessor,ExpressAppEnhanceBeanProcessor } from "./springMvcBeanProcessor";
import { SpringMvcStarter } from './springMvcContainer'
export {ExpressConfiguration} from './springMvcBeans'


export * from './springMvcConfiguration'


/**
 * SpringMvcStarter web启动器
 * ExpressAppEnhanceBeanProcessor ExpressConfiguration的后置处理器
 * ControllerBeanProcessor controller的后置处理器
 */
export const SpringMvcModule = [SpringMvcStarter,ControllerBeanProcessor,ExpressAppEnhanceBeanProcessor];