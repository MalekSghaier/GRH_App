import { Module } from '@nestjs/common';
import { PointageService } from './pointage.service';

@Module({
    providers: [PointageService],
    exports: [PointageService], 
  })
  export class PointageModule {}
  
