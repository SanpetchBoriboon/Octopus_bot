const express = require("express");
const { handler } = require("./controller");
const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.json());
app.post("*", async (req, res) => {
    console.log(req.body);
    const resp = await handler(req)
     res.send(resp);
});

app.get("*", async (req, res) => {
    res.send(await handler(req));
});

app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`Server is running on port ${PORT}`);
});
