## Installation

```bash
$ yarn install
```

## Running the app

First rename the `.env.example` to `.env` and provide the correct values for the data fields in the env file.

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

# API Documentation
The API exposes a generated and OPENAPI documentation. you can find that bundled in a swagger UI at [http://localhost:8080/api](http://localhost:8080/api)

# Tech and Features
* NestJS Frame work
* PostgreSQL as Database 
* Prisma ORM for ORM and migration and 


## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
