// This helper sends unexpected async route errors to the shared error handler.
export const asyncHandler = (routeFunction) => (request, response, next) => {
  Promise.resolve(routeFunction(request, response, next)).catch(next);
};
