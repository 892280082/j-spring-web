const path = require('path');
const {fastLog} = require('spring-ioc')

class MappingDelegate {

	//映射路径
	mapping;

	//调用类型 get/port/use
	invokeType;

	//返回类型
	responseType;

	//参数定义
	paramDefineList=[];

	//mvc容器
	mvc;

	constructor(mvc,beanDefine,controllerBean,methodDefine){

		this.beanDefine = beanDefine;
		this.controllerBean = controllerBean;
		this.methodDefine = methodDefine;
		this.mvc = mvc;

		this._resolveInovkeType();
		this._resloveMapping();
		this._resloveResponseType();
		this._resolveMethodParams();
	}



	//解析请求类型
	_resolveInovkeType(){
		const {methodDefine} = this;
		if(methodDefine.hasAnnotation('Get')){
			this.invokeType = 'get'; 
			return;
		}

		if(methodDefine.hasAnnotation('Post')){
			this.invokeType = 'post';
			return;
		}

		this.invokeType = 'use'
	}


	//解析映射
	_resloveMapping(){
		const {beanDefine,controllerBean,methodDefine} = this;

		const controllerBeanAnnotation = beanDefine.getAnnotation("Controller")

		//控制器的映射
		const controllerBeanMapping = controllerBeanAnnotation.param.value || "";

		//方法的映射
		const methodDefineMappingAnnotation = methodDefine.getAnnotation("Mapping") || methodDefine.getAnnotation("Get") || methodDefine.getAnnotation("Post");

		//最终方法映射 如果Mapping注解没有设置参数 则使用方法名
		const finalmethodDefineMapping = methodDefineMappingAnnotation.param.value || methodDefine.name;

		//最终映射 controllerBean+methodDefine
		this.mapping = path.join('/',controllerBeanMapping,finalmethodDefineMapping).replace(/\\/g,`/`)
	}

	//解析返回类型
	_resloveResponseType(){
		const {beanDefine,methodDefine} = this;

		if(beanDefine.hasAnnotation("Json") || methodDefine.hasAnnotation("Json")){
			this.responseType = 'JSON';
			return;
		}

		this.responseType = "HTML";

	}


	//解析方法上的参数
	_resolveMethodParams(){
		const {beanDefine, methodDefine} = this;

		//controller bean 定义的注解
		const paramDefine = methodDefine.getAnnotation('Param')

		this.paramDefineList = methodDefine.params.map(name => {
			const type = paramDefine && paramDefine.param[name] ? paramDefine.param[name] : 'notSet';
			return {name,type};
		})

	}

	//获取反射的 
	getReflectParam(req,res){
		return this.paramDefineList.map(p => {

			const {name,type} = p;

			if(type==='notSet'){
				switch(name){
					case 'request':return req;
					case 'response':return res;
					case 'session':return session;
					default:
						return req.query[name];
				}
			}

			let v;
			switch(type){
				case "path": v=req.params[name]; break;
				case "query":v=req.query[name];break;
				case "body":v=req.body;break;
				case "session":
					if(!req.session)
						throw `not load session module`
					v = req.session[name];break;
				default:
					throw `@Param annotation error.unkown type ${type}`
			}

			if(v === undefined){
				throw `[PARAM ERROR]: Parameter ${name} is missing`
			}

			return v;
		})
	}

	//对外暴漏的调用方法
	async invoke(req, res, next){
		
		const {controllerBean,methodDefine,beanDefine,responseType,mvc} = this;

		let refectParam,result = null;

		try{
			//计算反射参数
			refectParam = this.getReflectParam(req,res);
		}catch(e){
			res.status(400);
			res.json({error:e})
			return;
		}

		try{

			//业务处理
			result = await controllerBean[methodDefine.name].apply(controllerBean,refectParam);

		}catch(e){

			fastLog("MappingDelegate => invoke","error",e);

			mvc.springIocMvcExceptionHander[responseType.toLowerCase()](e,req,res);

			return;
		}
		
		switch(responseType){
			case 'JSON':res.json(result);break;
			case 'HTML':res.render(result.page,result.data);break;
			default:
				throw `responseType[${responseType}]错误，没有匹配的处理方法`
		}

	}

	//对暴漏的方法进行作用域绑定
	getMappingMethod(){
		const fn = this["invoke"].bind(this);
		return fn;
	}

	//批量解析该方法
	static analysisController(mvc,bean,beanDefine){

		const mappingList = beanDefine.methods.filter(methodDefine => {
			return methodDefine.hasAnnotation("Mapping") || methodDefine.hasAnnotation("Get") || methodDefine.hasAnnotation("Post")
		}).map(methodDefine => new MappingDelegate(mvc,beanDefine,bean,methodDefine))

		return mappingList;

	}

}




module.exports = {MappingDelegate}