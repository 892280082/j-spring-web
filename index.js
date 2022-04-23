const {SpringBoot} = require("spring-ioc")
const {SpringMvcScaner} = require("./spring_extends")


new SpringBoot({srcList:["./demo"],moduleList:[SpringMvcScaner("./spring_extends")]}).run();

