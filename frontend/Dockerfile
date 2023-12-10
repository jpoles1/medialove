FROM oven/bun

# install dependencies
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

COPY . .

FROM oven/bun

WORKDIR /app
COPY --from=0 /app .
COPY . .

COPY .env .env

#RUN bun run build
