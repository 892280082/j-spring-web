import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { Component } from "j-spring";
import { ParsedQs } from "qs";
import { Controller, ExpressMiddleWare, Get, Json, MiddleWare, PathVariable, RequestParam, ResponseBody } from "../../src/springMvcAnnotation";


@Component
class LogPrintMiddleWare implements ExpressMiddleWare{

    isExpressMidldleWare(): boolean {
        return true;
    }

    invoke(req: any, res: any, next: Function): void {
        req.query.name ='kitty'
        console.log('params',req.params);
        next();
    }
}


@Controller('/student')
export class StudentController {


    @Get('/getStudentInfo/:id')
    @ResponseBody
    @MiddleWare([LogPrintMiddleWare])
    async getStudentInfo(@PathVariable('id') id:string,@RequestParam('name') name:string){
        return {id,name}
    }


}