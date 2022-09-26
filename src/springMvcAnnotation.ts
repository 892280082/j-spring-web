import {spring} from 'j-spring'
import { isFunction } from "j-spring";

export type middleWareType = ((new()=>ExpressMiddleWare) | Function)[];

export type MappingParam = {
    path:string,
    middleWareClassList?:middleWareType
}


export const Controller = (path:string,middleWareClassList?:middleWareType) => spring.classAnnotationGenerator('j-spring.Controller',{path,middleWareClassList},Controller);


//类 发送json控制器
export const Json = ()=> spring.classAnnotationGenerator('j-spring.Controller',{},Json);


//方法控制器 get请求

export const Get = (path?:string,middleWareClassList?:middleWareType) => spring.methodAnnotationGenerator('j-spring.Get',{path,middleWareClassList},Get);

export const ResponseBody = () => spring.methodAnnotationGenerator('j-spring.ResponseBody',{},ResponseBody);

//方法控制器 Post请求

export const Post = (path?:string,middleWareClassList?:middleWareType) => spring.methodAnnotationGenerator('j-spring.Post',{path,middleWareClassList},Post);

//方法控制器 RequestMapping

export const RequestMapping = (path?:string,middleWareClassList?:middleWareType) => spring.methodAnnotationGenerator('j-spring.RequestMapping',{path,middleWareClassList},RequestMapping);


export type ParamterParamType = {
    name:string,
    type:Function
}

//express中间件
export interface ExpressMiddleWare {
    isExpressMidldleWare():boolean;
    invoke(req:any,res:any,next:Function):void
}

//判断是否是中间件
export function isExpressMiddleWare(obj:any){
    const a = obj as ExpressMiddleWare;
    return isFunction(a.invoke) && isFunction(a.isExpressMidldleWare) && a.isExpressMidldleWare();
}




//字段
export const PathVariable = (name:string,type?:Function) => spring.paramterAnnotationGenerator('j-spring.PathVariable',name,{name,type:type||String},PathVariable);
//字段
export const RequestParam = (name:string,type?:Function) => spring.paramterAnnotationGenerator('j-spring.RequestParam',name,{name,type:type||String},RequestParam);

export const RequestBody = (name:string,type?:Function) => spring.paramterAnnotationGenerator('j-spring.RequestBody',name,{name,type:type||String},RequestBody);