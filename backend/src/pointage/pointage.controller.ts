// pointage.controller.ts
import { Controller, Post, Req, Get, Query, Body, BadRequestException } from '@nestjs/common';
import { PointageService } from './pointage.service';
import { RequestWithUser } from 'express';

@Controller('pointage')
export class PointageController {
  constructor(private readonly pointageService: PointageService) {}

// @Post('scan-qr-data')
// async scanQrData(@Body() body: { qrData: string }) {
//   if (!body.qrData) {
//     throw new BadRequestException('QR data is required');
//   }
  
//   try {
//     const qrContent = JSON.parse(body.qrData);
//     if (!qrContent.id) {
//       throw new BadRequestException('Invalid QR code content');
//     }
    
//     return this.pointageService.enregistrerPointage(qrContent.id);
//   } catch (error) {
//     throw new BadRequestException('Invalid QR code format');
//   }
// }

  @Post('scan-qr-data')
  async scanQrData(@Body() body: { qrData: string }) {
    if (!body.qrData) {
      throw new BadRequestException({
        message: 'QR data is required',
        code: 'QR_DATA_MISSING'
      });
    }
    
    try {
      const qrContent = JSON.parse(body.qrData);
      if (!qrContent.id) {
        throw new BadRequestException({
          message: 'Invalid QR code content - missing user ID',
          code: 'INVALID_QR_CONTENT'
        });
      }
      
      return this.pointageService.enregistrerPointage(qrContent.id);
    } catch (error) {
      throw new BadRequestException({
        message: 'Invalid QR code format',
        code: 'INVALID_QR_FORMAT'
      });
    }
  }

  // @Post('scan-face')
  // async scanFace(@Body() body: { userId: string }) {
  //   if (!body.userId) {
  //     throw new BadRequestException('User ID is required');
  //   }
  //   return this.pointageService.enregistrerPointageFace(body.userId);
  // }

  @Post('scan-face')
  async scanFace(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException({
        message: 'User ID is required',
        code: 'USER_ID_MISSING'
      });
    }
    return this.pointageService.enregistrerPointageFace(body.userId);
  }
@Get('monthly')
async getMonthlyPointages(@Query('userId') userId: string,@Query('month') month: number,  @Query('year') year: number) {
  if (!userId) {
    throw new BadRequestException('User ID is required');
  }
  return this.pointageService.getPointagesByMonth(
    userId, 
    Number(month), 
    Number(year)
  );
}
  @Get('today')
   async getPresenceAujourdhui() {
   return this.pointageService.getPresenceAujourdhui();
  }

  @Get('by-date')
async getPointagesByDate(@Query('date') date: string) {
  if (!date) {
    throw new BadRequestException('La date est requise');
  }
  return this.pointageService.getPointagesByDate(date);
}
}