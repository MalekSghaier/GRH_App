//python.controller.ts
import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PythonService } from './python.service';
import { UsersService } from 'src/users/users.service';

interface PythonScriptResponse {
  status: 'success' | 'info' | 'error';
  message: string;
  user?: string;
  time?: string;
}

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService,
    private usersService: UsersService
  ) {}
  //launch test_final.py
  @Get('launch')
  async runScript(): Promise<PythonScriptResponse> {
    try {
      const result = await this.pythonService.runPythonScript();
      try {
        const jsonResult = JSON.parse(result) as PythonScriptResponse;
        return jsonResult;
      } catch (_) {
        return {
          status: 'info',
          message: result
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  //launch capture_image.py
  @Get('capture')
  async captureImage(): Promise<any> {
      try {
          const result = await this.pythonService.captureImage();
          return JSON.parse(result);
      } catch (error) {
          return {
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error occurred'
          };
      }
  }

  @Get('find-by-image/:imageId')
  async findUserByImageId(@Param('imageId') imageId: string): Promise<any> {
    const user = await this.usersService.findByImageId(imageId);
   if (!user) {
      throw new NotFoundException('Aucun utilisateur trouvé pour cette image');
    }
   return user;
  }
}