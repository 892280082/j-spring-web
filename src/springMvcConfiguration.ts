import { Component, Value } from 'j-spring';
import path from 'path';
import { ExpressConfiguration } from './springMvcExtends'
import {errorInfo,SpringMvcExceptionHandler} from './springMvcExtends'
/**
 * ejs页面配置
 */
@Component
export class EjsViewConfigruation implements ExpressConfiguration {

    @Value({path:'root',type:String})
    root:string;

    load(app: any): void {
        app.set('views', path.join(this.root,'view'));
        app.set('view engine', 'ejs');
    }
    
    isExpressConfiguration(): boolean {
        return true;
    }

}

/**
 * 默认异常处理
 */
@Component
export class SpringMvcExceptionHandlerConfigration implements SpringMvcExceptionHandler {

    hanlder(_req: any, res: any, errorInfo: errorInfo): void {
        console.log(errorInfo.error)
        res.status(500).json({error:errorInfo.error})
    }

}