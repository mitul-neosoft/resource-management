import { NextRequest, NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAuth, isAuthError, type AuthContext } from "@/lib/auth/apiAuth";
import { UserRole } from "@/constants/roles";

type HandlerContext = {
  req: NextRequest;
  auth: AuthContext;
  body: unknown;
  params: Record<string, string>;
};

type RouteHandler = (ctx: HandlerContext) => Promise<NextResponse>;

interface RouteOptions {
  roles?: UserRole[];
  schema?: ZodSchema;
  connect?: boolean;
}

export function createHandler(
  handler: RouteHandler,
  options: RouteOptions = {}
) {
  return async (
    req: NextRequest,
    context?: { params?: Promise<Record<string, string>> }
  ) => {
    try {
      if (options.connect !== false) {
        await connectDB();
      }

      const authResult = requireAuth(req);
      if (isAuthError(authResult)) {
        if (options.roles) return authResult;
      } else if (options.roles?.length) {
        if (!options.roles.includes(authResult.payload.role as UserRole)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }

      const auth = isAuthError(authResult)
        ? ({ payload: { userId: "", email: "", employeeId: "", role: UserRole.USER } } as { payload: AuthContext })
        : authResult;

      let body: unknown = undefined;
      if (req.method !== "GET" && req.method !== "DELETE") {
        const raw = await req.json().catch(() => ({}));
        body = options.schema ? options.schema.parse(raw) : raw;
      }

      const params = context?.params ? await context.params : {};

      return await handler({ req, auth: auth.payload, body, params });
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.flatten() },
          { status: 400 }
        );
      }
      console.error("API error:", error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Internal server error" },
        { status: 500 }
      );
    }
  };
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
