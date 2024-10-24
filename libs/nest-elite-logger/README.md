# nest-elite-logger

This is a logging library for services write for NestJS. It's base on [pino](https://github.com/pinojs/pino)

## Usage

### Replacing the default NestJS logger

Simply configure an instance of `EliteLoggerService` in the options when you initialize the application. You can also use `EliteLoggerService` to log directly in the main.ts file.

```typescript
const logger = new EliteLoggerService();
const app = await NestFactory.create(AppModule, { logger });
logger.log(`Starting application...`, 'Bootstrap');
```

You can use `EliteLoggerService` directly by adding it to the provider of the root module (usually AppModule).

```typescript
@Module({ providers: [EliteLoggerService] })
class AppModule implements OnModuleInit {
  constructor(private logger: EliteLoggerService) {}

  onModuleInit() {
    this.logger.log('Noop log message', 'AppModule');
  }
}
```

However, according to the default logging structure of NestJS, the last parameter is always the context. This can be cumbersome and repetitive. For this reason, I created another class called `EliteLogger`. You just need to create an instance of EliteLogger with different contexts specified in the input parameter.

```typescript
import { EliteLogger } from '@ebizbase/nest-elite-logger';

@Module({})
class AppModule implements OnModuleInit {
  private readonly logger = new EliteLogger('AppModule');

  onModuleInit() {
    this.logger.log('Noop log message');
  }
}
```

_Recommendation_:

- Use `EliteLoggerService` to override the default NestJS logger.
- Use `EliteLogger` to log within your application.

In this usage, EliteLogger is implemented by implementing the logger functions of pino. So the usage is similar to that of pino.

Use cases (Similar across all log functions):

**Log a simple message**:

```javascript
logger.info('Application started');
```

**Output**:

```json
{
  "level": 30,
  "time": 1649076543210,
  "msg": "Application started"
}
```

**Log a message with interpolation values**:

```javascript
logger.info('User %s performed action %s', 'john_doe', 'login');
```

**Output**:

```json
{
  "level": 30,
  "time": 1649076543210,
  "msg": "User john_doe performed action login"
}
```

**Log an object with a message**:

```javascript
logger.info({ user: 'john_doe', action: 'login' }, 'Action performed');
```

**Output**:

```json
{
  "level": 30,
  "time": 1649076543210,
  "user": "john_doe",
  "action": "login",
  "msg": "Action performed"
}
```

**Log an object with a message and interpolation values**:

```javascript
logger.info({ user: 'john_doe' }, 'User %s performed action %s', 'john_doe', 'login');
```

**Output**:

```json
{
  "level": 30,
  "time": 1649076543210,
  "user": "john_doe",
  "msg": "User john_doe performed action login"
}
```

### Environment Variables

| Environment Variable | Default Value | Description                                                                                         |
| -------------------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `LOG_FORMAT`         | `json`        | Log format, can be `json` or `text`.                                                                |
| `LOG_LEVEL`          | `info`        | Log level, can be `fatal`, `error`, `warn`, `info`, `debug`, or `trace` and `silent` with `silent`. |

### Log Levels:

| Level | Method  | Description                                                      |
| ----- | ------- | ---------------------------------------------------------------- |
| 10    | `trace` | Most detailed information, only for very deep debugging purposes |
| 20    | `debug` | Debug information about the processing flow                      |
| 30    | `info`  | General information about system operations                      |
| 40    | `warn`  | Warnings about events that may cause errors                      |
| 50    | `error` | Errors occurring in the system, but the system continues to run  |
| 60    | `fatal` | Critical errors, the system cannot continue to operate           |

By default, in JSON log format, levels are recorded as numbers, which helps with centralized log storage and indexing processes.

## Contribute

### Lint

Run `nx lint nest-elite-logger` to build the library.

### Running unit tests

Run `nx test nest-elite-logger` to execute the unit tests via [Jest](https://jestjs.io).

### Building

Run `nx build nest-elite-logger` to build the library.
