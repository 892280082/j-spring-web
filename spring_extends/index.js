const path = require("path")
const {SpringIocMvc} = require("./bean/SpringIocMvc")

//包加载器
const SpringIocMvcScaner =  (packageName='spring-ioc-mvc')=> {
	return [
			{
				packageName,
				srcList:[path.join(__dirname,"./bean")]
			}
		]
};

module.exports = {
	SpringIocMvcScaner,
	SpringIocMvc
}
