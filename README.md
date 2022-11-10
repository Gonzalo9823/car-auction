# Car Auction API V1

First version of the Cat Auction API used to power the different services needed.

This apps is written on TypeScript and uses `TypeORM` as the DDBB ORM and `Fastify` for the REST part.

## Missing On This Version

- Add images to vehicles.
- Tests.
- Send emails when necessary.
- Cron Job to check Publications.

## IMPORTANT

The is currently a problem with Kubernetes and the app runs but there is a problem with NextJS being use as a proxy.

## Docker

Just run `docker-compose up`

The back will be running on port `4000` and the front on port `3000`.

## Kubernetes

This app was tested on Kubernetes using [minikube](https://minikube.sigs.k8s.io/docs/start/) on macOS 12.6.

Firtst you need to start minikube with n nodes, for example 2.

```bash
  minikube start --nodes=2
```

Then you need to add the necessary addons to minikube.

```bash
  minikube addons enable registry # This allows kubernetes to find the images locally.
  minikube addons enable ingress  # This allows nginx-ingress to work.
```

To verify that `nginx-ingress` was correctly installed you can run:

```bash
  kubectl get pods -n ingress-nginx
```

And expect something like the following output:

```bash
  NAME                                        READY   STATUS      RESTARTS    AGE
  ingress-nginx-admission-create-g9g49        0/1     Completed   0          11m
  ingress-nginx-admission-patch-rqp78         0/1     Completed   1          11m
  ingress-nginx-controller-59b45fb494-26npt   1/1     Running     0          11m
```

After that you must add the docker image to minikube running the follwing command inside the root directory.

```bash
  minikube image build --all -t back-end/app  back/.
  minikube image build --all -t front-end/app front/.
```

Then you can apply the `deployment.yml` configuration running the follwing command inside the root directory.

```bash
  kubectl apply -f deployment.yml
```

To check that every is working fine you can run:

```bash
  kubectl get pods
```

And expect an output like this

```bash
  NAME                              READY   STATUS    RESTARTS   AGE
  back-end-56cc68f748-cgmq2         1/1     Running   0          5s
  back-end-56cc68f748-snfdz         1/1     Running   0          5s
  car-auction-db-865fbbcd59-zf6lr   1/1     Running   0          47s
```

If there is a `ErrImagePull` you can try any of the solutions describe [here](https://minikube.sigs.k8s.io/docs/handbook/pushing/#4-pushing-to-an-in-cluster-using-registry-addon).

Finally you can start the app by running.

```bash
  minikube tunnel
```

And going to localhost:80.

## Environment

To run this project you'll need to have:

`node@16.17.1`

`PostgreSQL@14`

And the following environment variables on your `.env` file:

- `DATABASE_URL`
- `APP_NEXT_PUBLIC_API_PORT`

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

## Deployment

You can deploy the app to an AWS ECS via Terraform.

### What you'll need

- `terraform cli` installed on your system.
- Updating the variables `access_key` and `secret_key` on `versions.tf`.

### Commands to deploy

```bash
  terraform init
```

```bash
  terraform plan -out="tfplan"
```

```bash
  terraform apply "tfplan"
```

**Currently only the front is deployed.**

## Package Scripts

| Script      | Description                                                                                   |
| ----------- | --------------------------------------------------------------------------------------------- |
| prepare     | Runs automatically after installing the dependencies to allow the running of .git pre hooks.  |
| postinstall | Runs automatically after installing the dependencies to apply some changes done to them.      |
| format      | Formats the files following the prettier rules.                                               |
| lint        | It tries to transpile the TypeScript files and checks if the linter rules are being followed. |
| build       | Transpiles the TypeScript code to JavaScript (production) code and deletes the src files.     |
| start       | Starts the project using the generated JavaScript code.                                       |
| typeorm     | Run TypeORM commands on production code.                                                      |
| start:dev   | Runs the project on Development mode.                                                         |
| typeorm:dev | Run TypeORM commands on development code.                                                     |

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
