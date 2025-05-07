//python.controller.ts
import { Controller, Get } from '@nestjs/common';
import { PythonService } from './python.service';

interface PythonScriptResponse {
  status: 'success' | 'info' | 'error';
  message: string;
  user?: string;
  time?: string;
}

@Controller('python')
export class PythonController {
  constructor(private readonly pythonService: PythonService) {}

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
}