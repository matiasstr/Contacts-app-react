import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateContactDto {
	@IsOptional()
	@IsString()
	firstName?: string;

	@IsOptional()
	@IsString()
	lastName?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	phone?: string;

	@IsOptional()
	@IsString()
	company?: string;

	@IsOptional()
	@IsString()
	jobTitle?: string;

	@IsOptional()
	@IsString()
	notes?: string;
}
