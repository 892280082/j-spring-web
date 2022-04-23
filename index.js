const {SpringBoot} = require("spring-ioc")
const {SpringIocMvcScaner} = require("./spring_extends")


new SpringBoot({srcList:["./demo"],moduleList:[SpringIocMvcScaner("./spring_extends")]}).run();

