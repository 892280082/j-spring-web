const {SpringBoot} = require("spring-ioc")
const {SpringIocMvcScaner} = require("./spring_extends")

const app = new SpringBoot({srcList:["./demo"],moduleList:[SpringIocMvcScaner("./spring_extends")]});

module.exports = {app}