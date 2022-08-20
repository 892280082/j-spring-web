const path = require("path")
const {SpringIocMvc} = require("./bean/SpringIocMvc")
const {SpringIocMvcSession} = require("./bean/SpringIocMvcSession")

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
	SpringIocMvc,
	SpringIocMvcSession
}
