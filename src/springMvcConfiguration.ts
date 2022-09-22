import { Component } from 'j-spring';
import { ExpressConfiguration } from './springMvcBeans'

/**
 * ejs页面配置
 */
@Component
export class EjsConfigruation implements ExpressConfiguration {

    load(app: any): void {
        console.log('add ejs configuration!');
    }
    
    isExpressConfiguration(): boolean {
        return true;
    }


}