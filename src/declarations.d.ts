import { Application as ExpressFeathers } from "@feathersjs/express";

// A mapping of service names to types. Will be extended in service files.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IServiceTypes {}
// The application instance type that will be used everywhere else
// eslint-disable-next-line @typescript-eslint/naming-convention
export type Application = ExpressFeathers<IServiceTypes>;
