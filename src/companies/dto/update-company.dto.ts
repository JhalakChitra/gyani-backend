import {
  IsEmail,
  IsOptional,
} from "class-validator";


export class UpdateCompanyDto {


  @IsOptional()
  companyName?: string;


  @IsOptional()
  legalName?: string;


  @IsOptional()
  businessType?: string;


  @IsOptional()
  mobile?: string;


  @IsOptional()
  @IsEmail()
  email?: string;


  @IsOptional()
  website?: string;



  // Address

  @IsOptional()
  address1?: string;


  @IsOptional()
  address2?: string;


  @IsOptional()
  city?: string;


  @IsOptional()
  state?: string;


  @IsOptional()
  pincode?: string;


  @IsOptional()
  country?: string;



  // Tax

  @IsOptional()
  gstNumber?: string;


  @IsOptional()
  panNumber?: string;


  @IsOptional()
  tanNumber?: string;


  @IsOptional()
  cinNumber?: string;



  // Financial

  @IsOptional()
  financialYearStart?: Date;


  @IsOptional()
  booksBeginning?: Date;


  @IsOptional()
  currency?: string;



  // Branding

  @IsOptional()
  logo?: string;


  @IsOptional()
  signature?: string;

}