/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as articles from "../articles.js";
import type * as auth from "../auth.js";
import type * as authActions from "../authActions.js";
import type * as bookings from "../bookings.js";
import type * as cms from "../cms.js";
import type * as email from "../email.js";
import type * as initData from "../initData.js";
import type * as notifications from "../notifications.js";
import type * as projects from "../projects.js";
import type * as quotes from "../quotes.js";
import type * as siteConfig from "../siteConfig.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  articles: typeof articles;
  auth: typeof auth;
  authActions: typeof authActions;
  bookings: typeof bookings;
  cms: typeof cms;
  email: typeof email;
  initData: typeof initData;
  notifications: typeof notifications;
  projects: typeof projects;
  quotes: typeof quotes;
  siteConfig: typeof siteConfig;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
