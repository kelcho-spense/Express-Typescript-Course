import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: 'Too many requests from this IP, please try again later.',
});
export default limiter;

/**
 * The `limiter` is a middleware that limits the number of requests
 * that can be made from a single IP address within a given time
 * window (15 minutes in this case). If the limit is exceeded, the
 * middleware will return a 429 status code and the message
 * "Too many requests from this IP, please try again later.".
 *
 * The `standardHeaders` option is set to `'draft-7'` which means
 * the middleware will use the combined `RateLimit` header. The
 * `legacyHeaders` option is set to `false` which means the
 * middleware will not use the `X-RateLimit-*` headers.
 *
 * The `windowMs` option is set to `15 * 60 * 1000` which means
 * the middleware will count the number of requests made within
 * the last 15 minutes. The `max` option is set to `100` which
 * means the middleware will allow up to 100 requests from a
 * single IP address within the given time window.
 *
 * The `message` option is set to the string "Too many requests
 * from this IP, please try again later." which is the message
 * that will be returned when the limit is exceeded.
 */
