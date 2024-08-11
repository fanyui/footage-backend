import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { SessionUserDto } from 'src/user/dto/session-user.dto';

/**
 * A function to retrieve the current user from the execution context.
 *
 * @param {ExecutionContext} context - The execution context to extract the current user from.
 * @return {SessionUserDto} The current user extracted from the execution context.
 */
const getCurrentUserFromContext = (
  context: ExecutionContext,
): SessionUserDto => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserFromContext(context),
);
