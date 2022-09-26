import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Component } from "j-spring";
import { ApiMiddleWare, Controller, ExpressMiddleWare, Get, Json, MiddleWare, Param, PathVariable, RequestParam, ResponseBody, SessionAttribute } from "../../src";


@Component
class XiaoAiMustBeExist implements ExpressMiddleWare {
    isExpressMidldleWare(): boolean {
        return true;
    }
    invoke(req: any, res: any, next: Function): void {
        if(! req.session?.name){
            throw `xiaoai must be exist!`
        }
        next();
    }
    
}


@Controller('/student')
export class StudentController {


    @Get()
    async index(){
        return ['index.ejs',{msg:'hello world'}]
    }


    @Get('/getStudentInfo/:id')
    @ResponseBody()
    async getStudentInfo(@PathVariable('id') id:string,@RequestParam('name') name:string,@Param('req') req:any){
        return {id,name}
    }


    @Get()
    @ResponseBody()
    async addSessionName(@Param('session') session:any){
        session['name'] = 'xiaoAi'
        return {msg:'add success!'}
    }

}


@Controller('xiaoai')
@ApiMiddleWare([XiaoAiMustBeExist])
export class XiaoAiController {

    @Get()
    @ResponseBody()
    async getXiaoAiName(@SessionAttribute('name') name:string){
        return {name}
    }


}