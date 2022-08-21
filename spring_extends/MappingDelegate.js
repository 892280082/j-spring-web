const path = require('path');
const {fastLog} = require('j-spring')
const { WrapSession,doAggregation } = require('./util')


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

		//首字母小写
		function lowerCaseFirstLetter(string) {
		  return string.charAt(0).toLowerCase() + string.slice(1);
		}

		const {beanDefine,controllerBean,methodDefine} = this;

		const controllerBeanAnnotation = beanDefine.getAnnotation("Controller")

		//控制器的映射
		const controllerBeanMapping = controllerBeanAnnotation.param.value || lowerCaseFirstLetter(beanDefine.name);

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

		//参数手动定义
		const paramDefine = methodDefine.getAnnotation('Param')

		//允许空值
		const isAllowNullStr = methodDefine.hasAnnotation('Null') ? (methodDefine.getAnnotation('Null').param.value || '') : '';

		//是否聚合
		const isAggregationStr = methodDefine.hasAnnotation('Aggregation') ? (methodDefine.getAnnotation('Aggregation').param.value || '') : '';

		this.paramDefineList = methodDefine.params.map(name => {

			const type = paramDefine && paramDefine.param[name] ? paramDefine.param[name] : '__NotSet__';

			const isAllowNull = isAllowNullStr.split(',').indexOf(name) > -1;

			const isAggregation = isAggregationStr.split(',').indexOf(name) > -1;

			return {name,type,isAllowNull,isAggregation};
		})

	}



	//获取反射的
	getReflectParam(req,res){

		return this.paramDefineList.map(p => {

			let v;
			const {name,type,isAllowNull,isAggregation} = p;


			if(type==='__NotSet__'){
				switch(name){
					case 'req':return req;
					case 'res':return res;
					case 'session':return req.session;
					case '$session':return new WrapSession(req.session);
					default:

						if(isAggregation){
							return doAggregation(req.query,name+'.')
						}

						v = req.query[name] || req.params[name] || req.body[name];
						//如果参数不存在 并且以$开头 会尝试从session中获取
						if(!v && name.indexOf('$') === 0){
							v = req.session[name];
						}

						//如果值不存在 并且没有设置允许为Null 则报错
						if(v === undefined && !isAllowNull)
							throw `paramter [${name}] can not be empty!`
						return v;
				}
			}

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

		const doHanderError = error => {
			mvc.springIocMvcExceptionHander['error_500'](req,res,{requestType:responseType.toLowerCase(),error});
		}

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

		}catch(error){

			fastLog("MappingDelegate => invoke","error",error);

			doHanderError(error);

			return;
		}

		//无结果 则不进行任何操作
		if(result === undefined){
			return;
		}


		switch(responseType){
			case 'JSON':res.json(result);break;
			case 'HTML':
				if(Array.isArray(result)){
					const [page,data] = result;
					const mixData = {...data,...( mvc.injectView &&  req.session ? req.session : {})}
					res.render(page,mixData);
				}else if(typeof result === 'string'){

					if(result.indexOf('redirect:') === 0){
						res.redirect(result.replace('redirect:',''))
						return;
					}
					if(result.indexOf('location:') === 0){
						res.redirect(result.replace('location:',''))
						return;
					}

					doHanderError('return opt error')

				}else{
					doHanderError('return value error;')
				}

				break;
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


	static  analysisControllerFilterAnnotatin(log,mvc,controllerBean,beanDefine){

		const filerMethod = beanDefine.methods.filter(m => m.hasAnnotation('Filter'))


		filerMethod.forEach(m => {

			const annotation = m.getAnnotation('Filter');

			//拦截路径
			const filterPath = annotation.param.value;

			if(!filterPath){
				throw `controller:${controllerBean.name} method:${m.name} filter path can not be empty!`
			}

			const path = filterPath.replace(/~/g,'*');

			log.trace(`request filter => ${path}`)

			mvc.app.use(path,async (req,res,next) => {

				const  result = await controllerBean[m.name].apply(controllerBean,[req,res]);

				result && next();

			})

		})

	}

}




module.exports = {MappingDelegate}
