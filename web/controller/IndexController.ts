import { spring } from 'j-spring';
import { json } from 'stream/consumers';
import {Controller,Json,Get, Post, RequestMapping, PathVariable} from '../../src/springMvcAnnotation'


@Controller('/')
@Json
export class IndexController {

    //测试1: 首页
    @Get('/')
    async index(){
        return 'hello world!'
    }

    //测试2: @Get 方法不加参数 默认使用方法名作为路径
    @Get()
    async getMsg(){
        return 'Get msg ok'
    }

    //测试3: @Get 方法不加参数 默认使用方法名作为路径
    @Post()
    async postMsg(){
        return 'Post msg ok'
    }

    //测试4:  接受Get和Post方法
    
    @RequestMapping()
    async requestMsg(){
        return 'RequestMapping msg ok'
    }

    //测试5:  接受Get和Post方法 增加路径
    @RequestMapping('/requestMsgPath')
    async requestMsgPath(){
        return 'RequestMapping msg ok'
    }

    //测试6： 获取resful参数
    @Get('/getResefulData/:data')
    async getResefulData(@PathVariable('data',String) data:string){
        return data;        
    }

    //测试7 获取
    @Get('/getResefulDataNumber/:data')
    async getResefulDataNumber(@PathVariable('data',Number) data:number){
        return data;        
    }


}
