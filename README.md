## Live URL

https://king-prawn-app-6w26k.ondigitalocean.app/

## About

This is a siple task management app. Users can create Boards, and each Board have Tasks. User can see tasks progress live as they are updated by other users.

This app is built on top off next.js with a custom server to utilize socket.io

## Getting Started

1- Create an account with any email address (no OTPs will be sent)

2- Create a board.

3- Create a task.

4- Drag & Drop task to update its status.

5- Task status will be updated for all users who are currently watching that Board.

## Local Environment

To run this app locally, follow these steps:

1- Clone the repo.

2- Run `npm i`.

3- Create a `.env.local` file, and add these environment variables:

```
port= 3000

NEXTAUTH_URL="http://localhost:3000"

MONGODB_CONNECTION_STRING= "...."

JWT_SECRET="54SA56DG4FA891234JK54"

NEXT_PUBLIC_API_URL="http://localhost:3000/api/"
```

## Missing requirements

1- Localization

2- Dockerization
