const {SpringBoot} = require("j-spring")
const {JSpringMvcScaner} = require("./spring_extends")
const {JSpringMvcSessionSqlite3Scaner} = require("j-spring-mvc-session-sqlite3")

//根目录以启动js文件为准
const app = new SpringBoot({
  srcList:["./demo"],
  moduleList:[JSpringMvcScaner("./spring_extends"),JSpringMvcSessionSqlite3Scaner]
});

module.exports = {app}
