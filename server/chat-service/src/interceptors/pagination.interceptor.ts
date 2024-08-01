// import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
// import { Request } from 'express';
// import { Observable } from 'rxjs';

// @Injectable()
// export class PaginationInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const { page, limit } = request.query;
//     const newQuery = {
//       ...request.query,
//       page: page ? Number(page) : 1,
//       limit: limit ? Number(limit) : 10,
//     };
//     request.query = newQuery;
//     return next.handle();
//   }
// }
