const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const {MappingDelegate} = require("../MappingDelegate")


//@Bean
class SpringIocMvc {

	app;

	server;

	//@Value(value=Spring-ioc-mvc.port,force=false)
	port=3000;

	//@Autowired
	springFactory;

	//@Value(value=Spring-ioc-mvc.views,force=false)
	springMvcView = 'views';

	//@Value(value=Spring-ioc-mvc.static,force=false)
	springMvcAssertStaticPath = '/static';

	//@Value(value=Spring-ioc-mvc.viewEngine,force=false)
	viewEngine = 'art';

	//@Value(value=Spring-ioc-mvc.session.injectView,force=false)
	injectView = true;

	//@Value(value=Spring-ioc.pattern,force=false)
	pattern = 'dev';


	//@Autowired(value=springIocMvcExceptionHander,force=false)
	springIocMvcExceptionHander = {
		error_404:(req,res)=>{
			res.status(404).send('404 PATH NOT FIND')
		},
		error_500:(req,res,{error}) => {
			res.status(500).json({error});
		}
	};

	log;

	async beanInit(){
		this.args = this.springFactory.args;
	}


	loadStaticAssert(){
		const {app,args} = this;
		const log = this.log.method("loadStaticAssert")
		const {springMvcAssertStaticPath} = this;
		const staticPath = path.join(args.rootPath,springMvcAssertStaticPath)
		log.trace({staticPath:`${springMvcAssertStaticPath} => ${staticPath}`})
		app.use(springMvcAssertStaticPath,express.static(staticPath));
	}

	//加载模板引擎
	loadViewEngine(){
		const {app,args} = this;
		const log = this.log.method("loadViewEngine")
		const {viewEngine} =this;
		log.trace({"view engine":viewEngine})
		app.set('view engine',viewEngine);

		switch(viewEngine){
			case 'ejs':break;
			case 'art':
				app.engine('art', require('express-art-template'))
				break;
			default:
				throw `not support view engine :${viewEngine}`
		}

		//设置模板路径
		const viewPath = path.join(args.rootPath, this.springMvcView);
		log.trace({viewPath})
		app.set('views', viewPath);
	}

	//扩展配置
	async extendExpressConfig(){

		const {app,args,springFactory} = this;

		const log = this.log.method("extendExpressConfig")


		const configExtendBeans = await springFactory.getBeanByAnnotation("SpringMvcAppExtend");

		for(let i=0;i<configExtendBeans.length;i++){
			await configExtendBeans[i].loadApp(app);
		}
	}

	//装配app
	async loadApp(){

		const log = this.log.method("loadApp")

		this.app = express();

		const {app,args} = this;
		// view engine setup

		//静态资源配置
		this.loadStaticAssert();

		//加载模板引擎
		this.loadViewEngine();
	
		//日志级别
		log.trace({"morganLogLevel":this.pattern})

		//扩展app配置
		await this.extendExpressConfig();

		app.use(logger(this.pattern));
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(cookieParser());

	

	}

	//启动web服务
	startWebServer(){

		return new Promise((resolve,reject) => {

			const log = this.log.method("startWebServer")

			const {app,port} = this;
			app.set('port', port);
			this.server = http.createServer(app);

			const {server} = this;

			server.listen(port);
			server.on('error', e=> {
				log.error("spring-ioc-mvc start error!")
				log.error(e)
				reject(e);
			});
			server.on('listening', ()=>{
				  var addr = server.address();
				  var bind = typeof addr === 'string'
				    ? 'pipe ' + addr
				    : 'port ' + addr.port;

				resolve();
				log.info('Listening on ' + bind);
			});

		})

	}

	//加载映射
	loadMapping(controllerBeanList){

		const log = this.log.method("loadMapping");

		controllerBeanList.forEach(controllerBean => {

			const define = this.springFactory.getBeanDefineByBean(controllerBean)

			const annotations = define.annotation.map(v => v.name)

			log.trace(`analysisController Bean:${define.name} ,Annotation:${annotations}`);

			//添加拦截器
			MappingDelegate.analysisControllerFilterAnnotatin(log,this,controllerBean,define);

			//获取映射委托处理对象集合
			const mappingControllerList = MappingDelegate.analysisController(this,controllerBean,define);

			const allMaping = mappingControllerList.map(v => v.mapping);

			mappingControllerList.forEach(delegateBean => {

				const {invokeType,mapping} = delegateBean;

				if(allMaping.filter(m => m === mapping).length > 1){
					throw `mapping repeat:${mapping}`
				}

				log.trace(`request mapping:${invokeType} => ${mapping}`)

				this.app[invokeType](mapping,delegateBean.getMappingMethod())

			})

		})


		// 最后添加404处理
		this.app.use((req,res)=>{
			this.springIocMvcExceptionHander.error_404(req,res)
		})

	}

	async start(){


		const log = this.log.method("start")

		log.trace("spring-mvc starting")

		//1.获取所有的controller注解
		const controllerBeanList = await this.springFactory.getBeanByAnnotation("Controller");

		if(controllerBeanList.length == 0)
			throw `not find Controller BeanDefine`


		log.trace(`find controller bean size:${controllerBeanList.length}`)

		//2.装载app
		await this.loadApp();

		//3.加载映射
		this.loadMapping(controllerBeanList);

		//3.启动服务器
		await this.startWebServer();
	}





}

module.exports = {SpringIocMvc}