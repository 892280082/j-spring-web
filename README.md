# <img src="doc/spring-framework.png" width="80" height="80"> Spring Framework For Node

# JSpringMvc
> 原生js实现SpringMvc框架。

- [j-spring](https://gitee.com/woaianqi/j-spring) 框架提供spring功能。
- 秒级启动，内存占用小。
- 路由的参数反射功能

# 生态
- [j-spring-mvc-session-sqlite3](https://gitee.com/woaianqi/j-spring-mvc-session-sqlite3) session模块

# 安装

```shell
npm install j-spring-mvc --save
```

# 创建项目
```shell
# 安装脚手架
> npm install j-spring-cli -g

# 启动脚手架，选择WEB项目
> j-spring-cli
```



# 文档
###  1.加载j-spring-mvc模块
文件：app.js
```js
const {SpringBoot} = require("j-spring")
//加载 web 模块
const {JSpringMvcScaner} = require("j-spring-mvc")
//加载web session模块
const {JSpringMvcSessionSqlite3Scaner} = require("j-spring-mvc-session-sqlite3")

//根目录以启动js文件为准
const app = new SpringBoot({
  srcList:["./demo"],//需要扫描的源码目录
  moduleList:[JSpringMvcScaner,JSpringMvcSessionSqlite3Scaner]
});

module.exports = {app}
```

###  2.启动
文件：demo/Application.js
```js
//@SpringBoot
class Application {

	//@Autowired
	jSpringMvc; //自动注入web模块的Bean


	async main(){

		//启动springmvc
		await this.jSpringMvc.start();

	}

}

 module.exports = { Application}
```

###  3.路由及参数反射
文件：参考文件列表
- demo/Controller/IndexController.js
- demo/Controller/SessionApiController.js

```js
//@Controller(apiTest)
class TestApiController {

	//@Autowired
	apiTestService;

	/**
		返回页面 [页面路径,页面渲染对象]
	*/

	//@Get
	async toPage(){
			return ['page path',{}]
	}

	/**
		参数 a,b 框架会自动反射query和param中的参数。
		获取不到则报400错
		返回json
	*/

	//@Get
	//@Json
	async queryParamTest(a,b){
		return this.apiTestService.doVerify(100,{a,b})
	}

	/**
		自动反射的参数
		request req
		response res
		session 插件带的sesion
		$session 封装过的session对象
		$util 辅助对象 例如下载文件
	*/

	//@Get
	async otherFn(request,response,session,$session,$util){
			...
	}

}
```

### 4.拦截器
> 就是在controller里面加上了一个@Filter

```js
//@Controller(sessionApi)
class SessionApiController {

	log;

	/**
		拦截整个controller的请求，通过true 拒绝false。
		其它操作例如重定向 请使用res操作。
	*/

	//@Filter(/sessionApi)
	async filterNoSessionRequest(req,res){
		return true;
	}

}

```


###  5.统一错误处理
> 实现name为jSpringMvcExceptionHander的Bean就可以了

```js
/**
	springmvc-全局异常捕获
	默认就是这么处理的，可以删除。
*/
//@Bean(jSpringMvcExceptionHander)
class JSpringMvcExceptionHander {

	log;

	error_404 = (req,res)=>{
			res.status(404).send('404 PATH NOT FIND')
	}

	error_500 = (req,res,{error}) => {
			res.status(500).json({error});
	}

}

```

###  6.扩展
> 实现添加@SpringMvcAppExtend注解的Bean即可。

```js

/**
	扩展express
*/

//@SpringMvcAppExtend
class SpringMvcAppExtendBean1 {

	log;

	async loadApp(app){
		 this.log.method('loadApp').debug("可以使用@SpringMvcAppExtend扩展express,可以存在多个！");
	}

}
```

# 证书

The Spring Framework For Node is released under version 2.0 of the [Apache License](https://www.apache.org/licenses/LICENSE-2.0).
