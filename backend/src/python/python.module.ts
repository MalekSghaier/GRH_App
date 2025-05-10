import { Module } from '@nestjs/common';
import { PythonService } from './python.service';
import { PythonController } from './python.controller';
import { UsersModule } from 'src/users/users.module';

@Module({      
    imports: [UsersModule], 
    providers: [PythonService],
    exports: [PythonService],
    controllers: [PythonController], 
})
export class PythonModule {

}
