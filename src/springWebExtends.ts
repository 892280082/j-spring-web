import {Anntation} from "j-spring";

export const isFunction = (val:unknown) :val is Function => typeof val === 'function';

export interface ExpressLoad {
    load(app:any):void;
}

//express App 配置
export interface ExpressConfiguration extends ExpressLoad {
    load(app: any):void;
    isExpressConfiguration():boolean;
}

export function isExpressConfiguration(bean:any){
    const ec = bean as ExpressConfiguration;
    return isFunction(ec.load) && isFunction(ec.isExpressConfiguration) && ec.isExpressConfiguration();
}


//参数拦截操作操作
export interface SpringWebParamInteceptor<T> {

    isSpringWebParamInteceptor():boolean;

    //获取注解
    getAnnotation():Function;

    //导出bean
    getBean(req:any,res:any,paramterAnnotation:Anntation):Promise<T> | T;

    //访问结束时  如何销毁bean
    destoryBean(bean:T):void;

}

export function isSpringWebParamInteceptor(bean:any){
    const t = bean as SpringWebParamInteceptor<any>;
    return isFunction(t.getAnnotation) && 
            isFunction(t.getBean) && 
            isFunction(t.destoryBean) && 
            isFunction(t.isSpringWebParamInteceptor) 
            && t.isSpringWebParamInteceptor();
}

//错误信息
export type errorInfo = {
    code:number,
    error:string,
    sendType:string
}

//SpringWeb 异常处理
export interface SpringWebExceptionHandler {

    isSpringWebExceptionHandler():boolean;

    //异常处理
    hanlder(req:any,res:any,errorInfo:errorInfo,next?:Function):void;

}

export function isSpringWebExceptionHandler(bean:any):boolean{
    const t= bean as SpringWebExceptionHandler;
    return isFunction(t.hanlder) && isFunction(t.isSpringWebExceptionHandler) && t.isSpringWebExceptionHandler();
}