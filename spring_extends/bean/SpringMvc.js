const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const {MappingDelegate} = require("../MappingDelegate")


//@Bean
class SpringMvc {

	app;

	server;

	//@Value(value=Spring-ioc-mvc.port,force=false)
	port=3000;

	//@Autowired
	springFactory;

	//@Value(value=Spring-ioc-mvc.views,force=false)
	springMvcView = 'views';

	//@Value(value=Spring-ioc-mvc.public,force=false)
	springMvcPublic = 'public';


	//@Value(value=Spring-ioc-mvc.morganLogLevel,force=false)
	morganLogLevel = 'dev';

	log;

	async beanInit(){
		this.args = this.springFactory.args;
	}

	//装配app
	loadApp(){

		const log = this.log.method("loadApp")

		this.app = express();

		const {app,args} = this;
		// view engine setup

		const staticPath = path.join(args.rootPath, this.springMvcPublic)
		const viewPath = path.join(args.rootPath, this.springMvcView);

		log.trace({staticPath})
		log.trace({viewPath})
		log.trace({"view engine":"ejs"})
		log.trace({"morganLogLevel":this.morganLogLevel})

		app.set('views', viewPath);
		app.set('view engine', 'ejs');


		app.use(logger(this.morganLogLevel));
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(cookieParser());

		app.use(express.static(staticPath));
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

			MappingDelegate.analysisController(controllerBean,define).forEach(delegateBean => {

				const {invokeType,mapping} = delegateBean;

				log.trace(`request mapping:${invokeType} => ${mapping}`)

				this.app[invokeType](mapping,delegateBean.getMappingMethod())

			})

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
		this.loadApp();

		//3.加载映射
		this.loadMapping(controllerBeanList);

		// this.app.get('/', function(req, res, next) {
		//   res.json({msg:"hello"})
		// });

		//3.启动服务器
		await this.startWebServer();
	}





}

module.exports = {SpringMvc}