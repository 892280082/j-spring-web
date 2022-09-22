import { BeanDefine, isFunction, MethodDefine } from "j-spring";
import path from "path";
import { json } from "stream/consumers";
import { Controller, ControllerParam, Get, GetParam, Json, ParamterParamType, PathVariable, Post, PostParam, RequestMapping, RequestMappingParam, RequestParam } from "./springMvcAnnotation";

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


type MethodRouterParm = {
    bean:any,
    bd:BeanDefine,
    md:MethodDefine
}

class MethodRouter {

    hasGet:boolean;
    hasPost:boolean;
    hasRequestMapping:boolean;

    invokeMethod:string;//get post use 

    sendType:string;//json html

    reqPath:string;//请求路径

    maxParamLength:number;//最大参数数量

    error(msg:string){
        throw new Error(`class:${this.option.bd.clazz} method:${this.option.md.name} router analysis error:${msg}`);
    }

    private resolveInokeMethod():string{
        if(this.hasRequestMapping)
            return 'use';
        if(this.hasGet && this.hasPost)
            return 'use';
        if(this.hasGet)
            return 'get';
        if(this.hasPost)
            return 'post';
        this.error('_resolveInokeMethod error')
        return '';
    }

    private resolveSendType():string {
        const {bd,md} = this.option;
        if(bd.hasAnnotation(Json) || md.hasAnnotation(json))
            return 'json';
        return 'html';
    }
    
    private resolveReqPath():string {
        const {bd,md} = this.option;
        const ctrPath = (bd.getAnnotation(Controller)?.params as ControllerParam).path;
        if(isEmpty(ctrPath)){
            this.error('resolveReqPath @Controller path not to be empty')
        }
        let mdPath:string ='';
        if(this.hasRequestMapping){
            mdPath = ((md.getAnnotation(RequestMapping)?.params as RequestMappingParam).path)
        }else if(this.hasGet){
            mdPath = ((md.getAnnotation(Get)?.params as GetParam).path)
        }else if(this.hasPost){
            mdPath = ((md.getAnnotation(Post)?.params as PostParam).path)
        }
        if(!mdPath || isEmpty(mdPath))
            mdPath = md.name;
        return  path.join(ctrPath,mdPath).replace(/\\/g,`/`);
    }

    private resolvePamaterLength():number{
        let i =0;
        this.option.md.paramterDefineList.forEach(p => {
            i = Math.max(i,p.index);
        })
        return i+1;
    }

    getInvokeParams(req:any):any[]{
        const {md} = this.option;
        const params = [];
        for(let i=0;i<this.maxParamLength;i++)
            params.push(undefined);

        md.paramterDefineList.forEach(p => {

            const requestParam = p.getAnnotation(RequestParam);
            if(requestParam){
                const annoParam = requestParam.params as ParamterParamType
                params[p.index] = req.query[annoParam.name]
                return;
            }

            const pathParam = p.getAnnotation(PathVariable);
            if(pathParam){
                const annoParam = pathParam.params as ParamterParamType
                params[p.index] = req.params[annoParam.name]
                return;
            }

        })

        return params;
    }

    constructor(public option:MethodRouterParm){
        const {md} = option;
        this.hasGet = md.hasAnnotation(Get);
        this.hasPost = md.hasAnnotation(Post);
        this.hasRequestMapping = md.hasAnnotation(RequestMapping);
        this.invokeMethod = this.resolveInokeMethod();
        this.sendType = this.resolveSendType();
        this.reqPath = this.resolveReqPath();
        this.maxParamLength = this.resolvePamaterLength();
    }


    loadExpressApp(app:any){

        const {md,bean} = this.option;
        const { invokeMethod,sendType,reqPath } =this;

        //代理的函数
        const proxyFunction = async (req:any,res:any) => {

            const params = this.getInvokeParams(req);
            const result = await bean[md.name].apply(bean,params);
            if(sendType === 'json'){
                return res.json(result)
            }
            switch(sendType){
                case 'json':
                    return res.json(result);
                    break;
                case 'html':
                    if(Array.isArray(result)){
                        return res.render(result[0],result[1]||{})
                    }else{
                        this.error('sendType:html only support array');
                    }
                    break;
                default:
                    this.error(`sendType error:${sendType}`)
            }
        }

        //执行的方法
        const appMethod = app[invokeMethod];

        appMethod.apply(app,[reqPath,proxyFunction])
        
    }

}

const isEmpty = (str:string) => typeof str === 'string' && str === '';

function hasTargetAnnotation(md:MethodDefine){
    return md.hasAnnotation(Get) || md.hasAnnotation(Post) || md.hasAnnotation(RequestMapping);
}

//controller配置
export class ControllerBeanConfiguration implements ExpressLoad {

    methodRouter:MethodRouter[] = [];

    constructor(public bean:any,public bd:BeanDefine){

        bd.methodList.filter(hasTargetAnnotation)
        .forEach(md => {

            this.methodRouter.push(new MethodRouter({bean,bd,md}))

        })

    }

    //加载express app
    load(_app: any): void {
        this.methodRouter.forEach(m => m.loadExpressApp(_app))
    }
}