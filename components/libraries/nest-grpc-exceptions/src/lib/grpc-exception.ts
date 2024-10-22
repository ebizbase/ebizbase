import { Dict } from '@ebizbase/common-types';
import { Metadata, status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export class GrpcException extends RpcException {
  private metadata: Metadata;
  private code: status;

  constructor(message: string, code: status, metadata?: Metadata | Dict<string>) {
    super(message);
    this.code = code;
    if (metadata instanceof Metadata) {
      this.metadata = metadata;
    } else if (metadata) {
      this.metadata = new Metadata();
      for (const key in metadata) {
        this.metadata.set(key, metadata[key]);
      }
    } else {
      this.metadata = new Metadata();
    }
  }

  getCode(): status {
    return this.code;
  }

  getMetadata(): Metadata {
    return this.metadata;
  }

  getError(): string | object {
    this.metadata.set('stack', JSON.stringify(this.stack));
    return {
      message: this.message,
      code: this.code,
      metadata: this.metadata,
    };
  }
}

export class GrpcUnknownException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.UNKNOWN, metadata);
  }
}

export class GrpcInvalidArgumentException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.INVALID_ARGUMENT, metadata);
  }
}

export class GrpcDeadlineExceededException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.DEADLINE_EXCEEDED, metadata);
  }
}

export class GrpcNotFoundException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.NOT_FOUND, metadata);
  }
}

export class GrpcAlreadyExistsException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.ALREADY_EXISTS, metadata);
  }
}

export class GrpcPermissionDeniedException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.PERMISSION_DENIED, metadata);
  }
}

export class GrpcResourceExhaustedException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.RESOURCE_EXHAUSTED, metadata);
  }
}

export class GrpcFailedPreconditionException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.FAILED_PRECONDITION, metadata);
  }
}

export class GrpcAbortedException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.ABORTED, metadata);
  }
}

export class GrpcOutOfRangeException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.OUT_OF_RANGE, metadata);
  }
}

export class GrpcUnimplementedException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.UNIMPLEMENTED, metadata);
  }
}

export class GrpcInternalException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.INTERNAL, metadata);
  }
}

export class GrpcUnavailableException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.UNAVAILABLE, metadata);
  }
}

export class GrpcDataLossException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.DATA_LOSS, metadata);
  }
}

export class GrpcUnauthenticatedException extends GrpcException {
  constructor(message: string, metadata?: Metadata | Dict<string>) {
    super(message, status.UNAUTHENTICATED, metadata);
  }
}
