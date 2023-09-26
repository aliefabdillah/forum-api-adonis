# forum-api-adonis
This is a Simple Forum Rest API using AdonisJS version 5 and written in TypeScript. In this project are include redis implementation for caching
## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Running Windows/Linux/Mac OS
- You have nodejs installed on your system (>= v14)
- You have npm installed on your system (>= v6)
- You have git installed

### Installation

Clone this repo

```bash
example> git clone https://github.com/aliefabdillah/forum-api-adonis.git
```

- then cd into project root directory you just cloned `> cd project-directory`
- inside root project directory run `> npm install` to install project dependencies.
- create .env file by copying from prepared .env.\* file. i.e

```bash
> cp .env.example .env # create/copy .env from .env.example
```

- generate app key and copy value to variable APP_KEY in file .env

```bash
> node ace generate:key
```
- run `npm run dev` to run adonis development server.
- the server accessible from a browser on `http://127.0.0.1:3333`