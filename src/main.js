import { app } from "./application/app.js";

const port = 3000
app.listen(port, () => {
    console.log(`App start at http://localhost:${port}`)
})