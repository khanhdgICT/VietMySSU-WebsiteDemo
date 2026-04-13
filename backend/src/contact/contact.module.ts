import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactSubmission } from './entities/contact-submission.entity';
import { ContactService } from './contact.service';
import { ContactPublicController, ContactAdminController } from './contact.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ContactSubmission])],
  providers: [ContactService],
  controllers: [ContactPublicController, ContactAdminController],
  exports: [ContactService],
})
export class ContactModule {}
