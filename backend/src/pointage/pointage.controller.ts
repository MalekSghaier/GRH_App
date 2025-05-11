// pointage.controller.ts
import { Controller, Post, Req, Get, Query, Body, BadRequestException } from '@nestjs/common';
import { PointageService } from './pointage.service';
import { RequestWithUser } from 'express';

@Controller('pointage')
export class PointageController {
  constructor(private readonly pointageService: PointageService) {}

@Post('scan-qr-data')
async scanQrData(@Body() body: { qrData: string }) {
  if (!body.qrData) {
    throw new BadRequestException('QR data is required');
  }
  
  try {
    const qrContent = JSON.parse(body.qrData);
    if (!qrContent.id) {
      throw new BadRequestException('Invalid QR code content');
    }
    
    return this.pointageService.enregistrerPointage(qrContent.id);
  } catch (error) {
    throw new BadRequestException('Invalid QR code format');
  }
}

  @Post('scan-face')
  async scanFace(@Body() body: { userId: string }) {
    if (!body.userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.pointageService.enregistrerPointageFace(body.userId);
  }

  @Get('monthly')
  async getMonthlyPointages( @Req() req: RequestWithUser, @Query('month') month: number, @Query('year') year: number) {
  return this.pointageService.getPointagesByMonth(
    req.user._id, 
    Number(month), 
    Number(year)
  );
}
}