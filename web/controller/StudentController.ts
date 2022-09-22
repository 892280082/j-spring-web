import { Component } from "j-spring";
import { Controller, Get, Json, PathVariable, ResponseBody } from "../../src/springMvcAnnotation";


@Controller('/student')
export class StudentController {


    @Get('/getStudentInfo/:id')
    @ResponseBody
    async getStudentInfo(@PathVariable('id') id:string){
        return {id}
    }


}