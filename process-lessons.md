# Development Process and Lessons Learned
### Planning and UI
I started by understanding the mechanics of the game, and basic requirements for the project. I drew out diagrams of what the UI might look like to establish a mental model of the different components I would need, and the data they would consume.

I wanted to implement TypeScript from end-to-end for its static type-checking, which would make the code more maintainable and extensible. I anticipated it would take a few days to setup the development environment with Webpack to enable hot module reloading, and Node Express as an API to route requests and serve content. React Router would be handy for navigating between frontend content, and reducing requests to the server. MongoDB would allow me to store user information and stats, and store session IDs for future authentication.

The game page is where the game play happens, and where users can create an account or login.
### Main Game Page - Game.tsx
![Game.tsx](/assets/Game-Screenshot.png)

After logging in, users can access more stats about their playing history, and add a time limit for the entire game to spice things up!
### Account Page - Account.tsx
![Account.tsx](/assets/Account-Screenshot.png)

### Webpack Configuration
One of the biggest headaches of the project was setting up webpack with TypeScript. It was easy to overlook slight differences in the configuration of TypeScript, webpack's entry point and output directory, what ports the Node server and Webpack dev server were running on, and where content was being served from (frontend/React/Webpack or backend/Node).

### Game Play Logic
After establishing a working development server, I could see the results of the game logic. In a separate utility function, I used a frequency hash to keep track of how many times each number showed up in the array fetched from the random number API. I then iterated over each guess to determine whether the number showed up in the answer's frequency hash, and whether it was strictly equal to the digit in the same position (is the `ith element` in `guess` the same as the `ith element` in `answer`?). These metrics were then shown in the Game.tsx component, and stored in an array to be rendered from most recent to oldest by the GuessHistory.tsx component. The number of guesses left was also decremented after each result was rendered.

### State Management
The mechanics of the game and what makes it responsive is through React. I ran into trouble when I tried to carry over state from the Account page into the Game page, but could not hoist it up since they were adjacent to one another. Finding Redux to be too bloated for this scenario, I learned about React's useContext which was a clean way to make the `isLoggedIn` state available across components. In the future, I would use this context tool as a central store for all my state so it is easily accessible wherever it is needed, without all the boilerplate code of Redux.

### Database
I used MongoDB Atlas to create a cloud instance where I could store session IDs, users' login information and game stats. I wanted to make a point of implementing database operations and building out routes that create, update and delete data on the database to build out the backend, personalize the game and establish opportunities to add more social features like multi-player games, or more data insights like wins, losses and performance over time.

| `Key`        | `Type` | `Required` | `Default`  | `Unique` |
| :----------- | :----- | :--------- | :--------- | :------- |
| `email`      | String | true       | no         | true     |
| `password`   | String | true       | no         | false    |
| `createdAt`  | Date   | false      | `Date.now` | false    |
| `wins`       | Number   | false    | 0 | false    |
| `losses`     | Number  | false     | 0 | false    |
| `favoriteNumber`  | Number  | false | null | false    |

### API
I used the middleware design pattern of `Express` which nicely organizes pertinent routes into a router. These routes can be injected with controllers and middleware depending on what that route needs. This was great for authentication so that with each relevant request, I could confirm the user was authenticated without having to recreate an authentication callback function. 

GET, POST and DELETE routes were used for fetching random numbers from the random API, fetching the user's game record stats, creating users' accounts and signing them in, as well as logging them out and deleting their accounts, which required destroying their session ID and deleting the local cookie made by Express Session. 

### Documentation
I would have liked to create more detailed documentation which outlines every route and controller with a description, their endpoints, as well as their inputs and outputs. I think this tabular means of modeling the Express API is really valuable for others, including myself, who may work on the project and build on top of it in the future.