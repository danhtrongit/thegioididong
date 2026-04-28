import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Đã có lỗi xảy ra trên hệ thống';
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse();

      if (typeof exResponse === 'string') {
        message = exResponse;
      } else if (typeof exResponse === 'object' && exResponse !== null) {
        const res = exResponse as Record<string, any>;
        message = res['message'] || message;

        // Handle class-validator errors
        if (Array.isArray(res['message'])) {
          message = 'Dữ liệu không hợp lệ';
          errors = {};
          for (const msg of res['message']) {
            if (typeof msg === 'string') {
              // Try to extract field name from validation message
              const parts = msg.split(' ');
              const field = parts[0] || 'general';
              if (!errors[field]) errors[field] = [];
              errors[field].push(msg);
            }
          }
        }

        if (res['errors']) {
          errors = res['errors'] as Record<string, string[]>;
        }
      }
    }

    // Map common HTTP status to Vietnamese messages
    if (exception instanceof HttpException) {
      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          if (message === 'Unauthorized') message = 'Bạn chưa đăng nhập';
          break;
        case HttpStatus.FORBIDDEN:
          if (message === 'Forbidden' || message === 'Forbidden resource')
            message = 'Bạn không có quyền thực hiện thao tác này';
          break;
        case HttpStatus.NOT_FOUND:
          if (message === 'Not Found' || message === 'Cannot GET')
            message = 'Không tìm thấy tài nguyên';
          break;
        case HttpStatus.BAD_REQUEST:
          if (message === 'Bad Request') message = 'Dữ liệu không hợp lệ';
          break;
        case HttpStatus.CONFLICT:
          if (message === 'Conflict') message = 'Dữ liệu đã tồn tại';
          break;
      }
    }

    const responseBody: Record<string, any> = {
      success: false,
      message,
    };

    if (errors && Object.keys(errors).length > 0) {
      responseBody['errors'] = errors;
    }

    response.status(status).json(responseBody);
  }
}
