# Setting up the project

Please follow the given steps to setup the project locally on your machine

1. Fork this repository
2. Open terminal and run the following command to clone the repository locally

```
git clone https://github.com/<your-github-usernmae>/clean-catalogue-web.git
```

3. Change the directory to `server` directory and install the dependencies

```
cd clean-catalogue/server
```

```
npm install
```

4. Run the server

```
npm run dev
```

> The server should be running locally at `http://localhost:3000`

5. Change directory to `frontend` and install the dependencies in another terminal

```
cd clean-catalogue/frontend
```

```
npm install
```

6. Set up clerk auth by following this [guide](https://clerk.com/docs/quickstarts/react?_gl=1*1mkdgvu*_gcl_au*ODkzODUyNDk2LjE3MDUxNDY3MDU.*_ga*MTQ0MzMyOTgzOS4xNzA1MTQ2NzA1*_ga_1WMF5X234K*MTcwNjAwNjc2Mi42LjEuMTcwNjAwNjgyNy4wLjAuMA..)

7. Copy `.env.example` to create a file `.env`

```
cp .env.example .env
```

8. Paste your `VITE_CLERK_PUBLISHABLE_KEY` in `.env` file

9. Run the frontend

```
npm run dev
```

> The frontend should be running on `http://localhost:5173`
