import {spring} from 'j-spring'


//类 控制器注解
export type ControllerParam = {
    path:string
}
export const Controller = (path:string) => spring.classAnnotationGenerator('j-spring.Controller',{path},Controller);


//类 发送json控制器
export const Json = spring.classAnnotationGenerator('j-spring.Controller',{});


//方法控制器 get请求

export type GetParam = {
    path:string
}

export const Get = (path?:string) => spring.methodAnnotationGenerator('j-spring.Get',{path},Get);

export const ResponseBody = spring.methodAnnotationGenerator('j-spring.ResponseBody',{});

//方法控制器 Post请求

export type PostParam = {
    path:string
}

export const Post = (path?:string) => spring.methodAnnotationGenerator('j-spring.Post',{path},Post);

//方法控制器 RequestMapping

export type RequestMappingParam = {
    path:string
}

export const RequestMapping = (path?:string) => spring.methodAnnotationGenerator('j-spring.RequestMapping',{path},RequestMapping);


export type ParamterParamType = {
    name:string,
    type:Function
}

//字段
export const PathVariable = (name:string,type?:Function) => spring.paramterAnnotationGenerator('j-spring.PathVariable',name,{name,type:type||String},PathVariable);
//字段
export const RequestParam = (name:string,type?:Function) => spring.paramterAnnotationGenerator('j-spring.RequestParam',name,{name,type:type||String},RequestParam);

export const RequestBody = (name:string,type?:Function) => spring.paramterAnnotationGenerator('j-spring.RequestBody',name,{name,type:type||String},RequestBody);