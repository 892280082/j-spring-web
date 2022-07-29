

//@SpringMvcAppExtend
class SpringIocMvcSession {

	//@Value(value=Spring-ioc-mvc.session.isUse,force=false)
	isUse=true;

	//@Value(value=Spring-ioc-mvc.session.secret,force=false)
	secret="keyboard cat";

	//@Value(value=Spring-ioc-mvc.session.maxAge,force=false)
	maxAge= 60 * 60 * 1000; //1 hour

	log;

	loadApp(app){

		const {log,isUse,secret,maxAge} = this;

		if(isUse){

			log.method('loadApp').debug('@SpringMvcAppExtend: use default sqliteDB session!')

   			const session = require('express-session');
    		const SQLiteStore = require('connect-sqlite3')(session);

			app.use(session({
		        store: new SQLiteStore,
		        secret: secret,
		        cookie: { maxAge },
		        resave:true,
		        saveUninitialized:true
			}));
			
		}

	}

}

module.exports = {SpringIocMvcSession}