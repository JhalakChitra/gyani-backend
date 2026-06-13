import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';


import { CompaniesService } from './companies.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';



@Controller("companies")
export class CompaniesController {



constructor(
  private service: CompaniesService
){}




@Post()
@UseGuards(JwtAuthGuard)
create(
  @Req() req,
  @Body() dto: CreateCompanyDto
){

  return this.service.create(
    req.user.sub,
    dto
  );

}





@Get()
@UseGuards(JwtAuthGuard)
list(
  @Req() req
){

  return this.service.findByUser(
    req.user.sub
  );

}





@Patch(":id")
@UseGuards(JwtAuthGuard)
update(

  @Param("id") id:string,

  @Req() req,

  @Body() dto:UpdateCompanyDto

){

 return this.service.update(
    id,
    req.user.sub,
    dto
 );

}



}