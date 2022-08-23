const path = require("path")
const {SpringIocMvc} = require("./bean/SpringIocMvc")

//包加载器
const SpringIocMvcScaner =  (packageName='j-spring-mvc')=> {
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
