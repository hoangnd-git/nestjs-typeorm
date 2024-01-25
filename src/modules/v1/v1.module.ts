import { RouterModule, Routes } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';

const routes: Routes = [
  {
    path: '/v1',
    children: [{ path: '/auth', module: AuthModule }],
  },
];

@Module({
  imports: [RouterModule.register(routes), AuthModule],
  controllers: [],
})
export default class V1Module {}
