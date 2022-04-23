const path = require("path")
const {SpringMvc} = require("./bean/SpringMvc")

//包加载器
const SpringMvcScaner =  (packageName='spring-mvc')=> {
	return [
			{
				packageName,
				srcList:[path.join(__dirname,"./bean")]
			}
		]
};

module.exports = {
	SpringMvcScaner,
	SpringMvc
}
