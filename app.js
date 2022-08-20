const {SpringBoot} = require("j-spring")
const {SpringIocMvcScaner} = require("./spring_extends")

//根目录以启动js文件为准
const app = new SpringBoot({srcList:["./demo"],moduleList:[SpringIocMvcScaner("./spring_extends")]});

module.exports = {app}