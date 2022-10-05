# Car Auction API V1

First version of the Cat Auction API used to power the different services needed.

This apps is written on TypeScript and uses `TypeORM` as the DDBB ORM and `Fastify` for the REST part.

## Missing On This Version

- Add images to vehicles.
- Tests.
- Send emails when necessary.
- Cron Job to check Publications.
- Front End

## IMPORTANT

This version of the App does not count with a Front End so to test the different end points you must use SwaggerUI which can be access on [http://localhost:4000/docs](http://localhost:4000/docs).

## Docker?

Just run `docker-compose up`

## Environment

To run this project you'll need to have:

`node@16.17.1`

`PostgreSQL@14`

And the following environment variables on your `.env` file:

`DATABASE_URL`


## Run Locally

Clone the project

```bash
  git clone git@github.com:Gonzalo9823/car-auction.git
```

Go to the project directory

```bash
  cd API-V1
```

Install dependencies

```bash
  npm install
```

Run the DDBB migrations

```bash
  npm run typeorm:dev migration:run
```

Seed the DDBB

```bash
  npm run typeorm:seed:dev
```

Start the server

```bash
  npm run start:dev
```

**By default the API will run on port 4000.**


## Package Scripts

| Script           	          | Description                                                                                   	|
|-----------------------------|-----------------------------------------------------------------------------------------------	|
| prepare          	          | Runs automatically after installing the dependencies to allow the running of .git pre hooks.  	|
| postinstall      	          | Runs automatically after installing the dependencies to apply some changes done to them.      	|
| format           	          | Formats the files following the prettier rules.                                               	|
| lint             	          | It tries to transpile the TypeScript files and checks if the linter rules are being followed. 	|
| build            	          | Transpiles the TypeScript code to JavaScript (production) code and deletes the src files.     	|
| start            	          | Starts the project using the generated JavaScript code.                                       	|
| typeorm          	          | Run TypeORM commands on production code.                                                      	|
| start:dev        	          | Runs the project on Development mode.                                                         	|
| typeorm:dev      	          | Run TypeORM commands on development code.                                                     	|

## Architecture

The API uses a Hexagonal Architecture following a DDD:

<br/>
<img src="/assets/hexagonal-architecture.png" alt="Hexagonal Architecture" height="300" />
<br/>

Using this architecture one can divide the important parts of the app on 3 parts:

- **Entities (Applications):** Where the business logic lives (How everything must work).
- **Data Sources (Infrastructure):** Where the save and retrieve data part of the apps work (For Example, the DDBB or a service like Google Maps).
- **Transport Layer (Interface):** How the data is send to the user (Like a HTTP REST Api or a CLI).

## Folder Structure

```bash
src
   ├── ...
   ├── [domain]                # Name of the domain E.g. User
   │   ├── applications        # Business Logic E.g. findUserById()
   │   ├── domain              # What and how to use E.g. User & UserDBRepository
   │   ├── infrastructure      # Implementation of the Repository E.g. UserTypeORMRepository
   │   └── interface           # How to send the data E.g. UserController
   └── ...
```

