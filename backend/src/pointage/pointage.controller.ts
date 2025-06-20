// pointage.controller.ts
import { Controller, Post, Get, Query, Body, BadRequestException, Param } from '@nestjs/common';
import { PointageService } from './pointage.service';
@Controller('pointage')
export class PointageController {
  constructor(private readonly pointageService: PointageService) {}

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

  @Get('working-days')
  async getWorkingDays( @Query('userId') userId: string, @Query('month') month: number, @Query('year') year: number
) {
  if (!userId || !month || !year) {
    throw new BadRequestException('User ID, month and year are required');
  }
  return this.pointageService.getJoursTravailles(userId, year, month);
}

@Get('ponctualite-score/:userId')
async getPonctualiteScore(@Param('userId') userId: string) {
  if (!userId) {
    throw new BadRequestException('User ID is required');
  }
  return this.pointageService.calculatePonctualiteScore(userId);
}

@Get('pointage-stats/:userId')
async getPointageStats(@Param('userId') userId: string) {
  if (!userId) {
    throw new BadRequestException('User ID is required');
  }
  return this.pointageService.getPointageStats(userId);
}
}