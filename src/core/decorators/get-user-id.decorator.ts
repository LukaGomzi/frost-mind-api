import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): number | null => {
        const request = ctx.switchToHttp().getRequest();
        if (request.user?.userId) return request.user?.userId;
        else return null;
    },
);
