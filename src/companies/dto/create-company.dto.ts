import {
 IsEmail,
 IsNotEmpty,
 IsOptional,
 IsString,
 IsDateString
} from "class-validator";


export class CreateCompanyDto {


@IsNotEmpty()
@IsString()
companyName!:string;


@IsNotEmpty()
@IsString()
legalName!:string;


@IsNotEmpty()
@IsString()
businessType!:string;


@IsNotEmpty()
@IsString()
mobile!:string;



@IsEmail()
email!:string;



@IsOptional()
website?:string;



@IsNotEmpty()
address1!:string;


@IsOptional()
address2?:string;



@IsNotEmpty()
city!:string;


@IsNotEmpty()
state!:string;


@IsNotEmpty()
pincode!:string;



@IsOptional()
gstNumber?:string;


@IsOptional()
panNumber?:string;


@IsOptional()
tanNumber?:string;


@IsOptional()
cinNumber?:string;



@IsOptional()
@IsDateString()
financialYearStart?:Date;


@IsOptional()
@IsDateString()
booksBeginning?:Date;



@IsNotEmpty()
currency!:string;



@IsOptional()
logo?:string;


@IsOptional()
signature?:string;


}