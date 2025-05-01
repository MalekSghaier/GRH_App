import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class PythonService {
  async runPythonScript(): Promise<string> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('C:\\Users\\HP\\Desktop\\IA\\new-venv\\Scripts\\python', ['test_final.py'], {
        cwd: 'C:\\Users\\HP\\Desktop\\IA'
      });

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        const dataStr = data.toString();
        console.log('Python Output:', dataStr);
        output += dataStr;
        
        try {
          const jsonData = JSON.parse(dataStr.trim());
          if (jsonData.status === 'success' || jsonData.status === 'info') {
            pythonProcess.kill();
            resolve(dataStr.trim());
          }
        } catch (_) {  // Utilisation de _ pour indiquer une variable intentionnellement non utilisée
          // Continuer à accumuler les données
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error('Python Error:', data.toString());
      });

      pythonProcess.on('close', (code) => {
        if (code === 0 || output) {
          resolve(output.trim());
        } else {
          reject(new Error(errorOutput || 'Python script failed'));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });

      setTimeout(() => {
        if (!pythonProcess.killed) {
          pythonProcess.kill();
          reject(new Error('Python script timeout after 30 seconds'));
        }
      }, 30000);
    });
  }
}