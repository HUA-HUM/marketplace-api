import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OnCityAppTokenLoginService } from 'src/app/services/oncity/auth/OnCityAppTokenLoginService';

@ApiTags('oncity')
@Controller('oncity/auth')
export class OnCityAppTokenLoginController {
  constructor(private readonly service: OnCityAppTokenLoginService) {}

  @ApiOperation({
    summary: 'Obtener app token login de VTEX para OnCity',
    description: 'Usa ONCITY_ACCOUNT, ONCITY_APP_KEY y ONCITY_APP_TOKEN desde variables de entorno.'
  })
  @Post('apptoken/login')
  async execute(): Promise<unknown> {
    return this.service.execute();
  }
}
