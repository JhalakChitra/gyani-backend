import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';



@Injectable()
export class CompaniesService {



constructor(
  private prisma: PrismaService
){}





async create(
  userId: string,
  dto: CreateCompanyDto
){

  return this.prisma.company.create({

    data: {
      ...dto,
      userId
    }

  });

}






async findByUser(
  userId:string
){

  return this.prisma.company.findMany({

    where:{
      userId
    }

  });

}







async update(

  id:string,

  userId:string,

  dto:UpdateCompanyDto

){


  return this.prisma.company.update({

    where:{

      id,
      userId

    },


    data:dto

  });


}






async delete(

  id:string,

  userId:string

){


 return this.prisma.company.delete({

   where:{

    id,
    userId

   }

 });


}





}