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

	//@Value(value=spring-mvc.port,force=false)
	port=3000;

	//@Autowired
	springFactory;

	//@Value(value=spring-mvc.views,force=false)
	springMvcView = 'views';

	//@Value(value=spring-mvc.views,force=false)
	springMvcPublic = 'public';

	beanInit(){
		this.args = this.springFactory.args;
	}

	//装配app
	loadApp(){
		this.app = express();
		const {app,args} = this;
		// view engine setup
		app.set('views', path.join(args.rootPath, this.springMvcView));
		app.set('view engine', 'ejs');

		app.use(logger('dev'));
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));
		app.use(cookieParser());
		app.use(express.static(path.join(args.rootPath, this.springMvcPublic)));
	}

	//启动web服务
	startWebServer(){
		const {app,port} = this;
		app.set('port', port);
		this.server = http.createServer(app);

		const {server} = this;

		server.listen(port);
		server.on('error', e=> console.log(e) );
		server.on('listening', ()=>{
			  var addr = server.address();
			  var bind = typeof addr === 'string'
			    ? 'pipe ' + addr
			    : 'port ' + addr.port;
			  console.log('Listening on ' + bind);
		});

		console.log(`spring-mvc模块已启动 端口:${port}`)
	}

	//加载映射
	loadMapping(controllerBeanList){

		controllerBeanList.forEach(controllerBean => {

			const define = this.springFactory.getBeanDefineByBean(controllerBean)

			MappingDelegate.analysisController(controllerBean,define).forEach(delegateBean => {

				console.log({delegateBean});
				const {invokeType,mapping} = delegateBean;
				this.app[invokeType](mapping,delegateBean.getMappingMethod())

			})

		})
	}

	async start(){


		console.log("spring-mvc模块装载")

		//1.获取所有的controller注解
		const controllerBeanList = await this.springFactory.getBeanByAnnotation("Controller");

		if(controllerBeanList.length == 0)
			throw `not find Controller BeanDefine`

		//2.装载app
		this.loadApp();

		//3.加载映射
		this.loadMapping(controllerBeanList);

		this.app.get('/', function(req, res, next) {
		  res.json({msg:"hello"})
		});

		//3.启动服务器
		this.startWebServer();
	}





}

module.exports = {SpringMvc}