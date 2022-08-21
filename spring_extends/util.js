const fs = require('fs')
const mime = require('mime');
const path = require('path')

//封装基础session
class WrapSession {
	constructor(session){
		this.session = session;
	}
	get(key){
		const v = this.session[key]
		if(!v)
			throw `session key [${key}] not exist`
	}
	getOr(key,defaultValue){
		if(this.session[key])
			return this.session[key];
		this.session[key] = defaultValue;
		return this.session[key];
	}
	destory(key){
		this.session[key] = undefined;
	}
	set(key,value){
		this.session[key] = value;
	}
}


/**
	聚合map
	const dataMap = {
		'stu.info.type':'xiaoban',
		'stu.info.class':'demaxiya',
		'stu.name':"zhansan",
		'stu.age':12
	}
	{
	  info: { type: 'xiaoban', class: 'demaxiya' },
	  name: 'zhansan',
	  age: 12
	}
*/
const doAggregation = (dataMap,prefix) => {

	let data = {};

	const addAttr = (d,keys,value) => {
		for(let i=0;i<keys.length;i++){
			const key = keys[i];
			if(i === keys.length-1){
				d[key] = value;
				break;
			}
			if(d[key]){
				d = d[key];
			}else{
				d[key] = {};
				d = d[key];
			}

		}
	}

	for(let p in dataMap){

		if(p.indexOf(prefix) === 0){
			addAttr(data,p.replace(prefix,"").split('.'),dataMap[p])
		}

	}

	return data;
}

class RequestUtil {

  req;

  res;

  constructor(req,res){
    this.req = req;
    this.res = res;
  }

  /**
    发送文件流
  */
  sendFile(filePath){

    const {res} = this;

    return new Promise((r,j) => {

      fs.access(filePath, fs.F_OK, (err) => {
        
        if (err) {
          return j(err)
        }

        res.setHeader('Content-Type', mime.getType(filePath))

        const cs = fs.createReadStream(filePath);

        cs.on("data", chunk => {
            res.write(chunk);
        })

        cs.on("end", () => {
            res.status(200);
            res.end();
            r();
        })

      })

    })

  }



}




















module.exports = {WrapSession,doAggregation,RequestUtil}
