const path = require("path")
const {JSpringMvc} = require("./bean/JSpringMvc")

//包加载器
const JSpringMvcScaner =  (packageName='j-spring-mvc')=> {
	return [
			{
				packageName,
				srcList:[path.join(__dirname,"./bean")]
			}
		]
};

module.exports = {
	JSpringMvcScaner,
	JSpringMvc
}
