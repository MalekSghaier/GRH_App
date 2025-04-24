// pointage.controller.ts
import { Controller, Post, UseGuards, Req, Get, Query } from '@nestjs/common';
import { PointageService } from './pointage.service';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'express';

@Controller('pointage')
export class PointageController {
  constructor(private readonly pointageService: PointageService) {}

  @Post('scan')
  @UseGuards(AuthGuard('jwt'))
  async scanQrCode(@Req() req: RequestWithUser) {
    const userId = req.user._id;
    return this.pointageService.enregistrerPointage(userId);
  }

  @Get('monthly')
  @UseGuards(AuthGuard('jwt'))
async getMonthlyPointages( @Req() req: RequestWithUser, @Query('month') month: number, @Query('year') year: number) {
  return this.pointageService.getPointagesByMonth(
    req.user._id, 
    Number(month), 
    Number(year)
  );
}
}