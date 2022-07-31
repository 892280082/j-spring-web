# spring-mvc

#### 介绍
- 1.原生js实现了运行时拿到注解
- 2.高度还原java的SpringMvc
- 3.可以直接注入Npm包到Spring容器

```js

//@SpringBoot
class Application {

	//@Autowired
	springIocMvc;


	async main(){

		//启动springmvc
		await this.springIocMvc.start();

	}

}

//@Controller(/)
class IndexController {

	log;

	//@Value(Spring-ioc-mvc.port)
	port;

	//@Autowired
	apiTestService;

	/**
		路由：/
		参数：req,res,session,$session 均可以自动注入 
			 $session 代表的是包裹的session，提供的额外的api
	*/

	//@Get(/)
	async index(req,res,session,$session){
		...
	}

}

````

#### 运行
```shell
	npm install && node index.js 
	#打开浏览器 localhost:3000
```

#### 文档
 使用基本跟java的Spring一致，后面在补充。

