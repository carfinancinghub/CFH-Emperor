export class AppError extends Error {
  public code?: string;
  public cause?: unknown;
  constructor(message: string, opts?: { code?: string; cause?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = opts?.code;
    this.cause = opts?.cause;
  }
}

/** Convenience throw helper */
export function raise(message: string, code?: string): never {
  throw new AppError(message, { code });
}

/** HTTP-flavored error helpers used across services */
export class BadRequestError extends AppError {
  constructor(message = "Bad Request", opts?: { cause?: unknown }) {
    super(message, { code: "BAD_REQUEST", cause: opts?.cause });
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", opts?: { cause?: unknown }) {
    super(message, { code: "NOT_FOUND", cause: opts?.cause });
    this.name = "NotFoundError";
  }
}

// (Optional future-proofing)
// export class UnauthorizedError extends AppError { ... }
// export class ForbiddenError   extends AppError { ... }
// export class ConflictError    extends AppError { ... }

export default AppError;
