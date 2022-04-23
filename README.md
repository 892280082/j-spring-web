# spring-mvc

#### intruoduce
1. zhice teamson company development this module and all right reserved!
2. attention ! just suport the spring-ioc framework.


#### install 

npm instlal spring-mvc

#### usage 

##### 1.set the configuration file 

###### file path: ${Project}/resource/SpringMvc.json
###### basic config:
```json
{
	"msg":"hello world"
}
```


#### 2. load email module at launch.
```js
const {SpringBoot} = require("spring-ioc")
const {SpringMvcScaner} = require("spring-mvc")

new SpringBoot({
	srcList:["./app"],
	moduleList:[SpringMvcScaner]
}).run();
```

#### 3. call in the spring container!
```js
//@SpringBoot
class Application {

	//just copy the code of next line is done!
	//@Autowired
	springMvc;

	async main(){

		this.springMvc.say();

	}

}
```



