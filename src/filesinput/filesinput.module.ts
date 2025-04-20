import { Module } from '@nestjs/common';
import { FilesinputController } from './filesinput.controller';
import { FilesinputService } from './filesinput.service';

@Module({
  controllers: [FilesinputController],
  providers: [FilesinputService]
})
export class FilesinputModule {}
