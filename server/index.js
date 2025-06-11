const express = require("express");
const morgan = require("morgan");

const {
    signUp,
    logIn,
    addShowToUser,
    searchShow,
    removeShowFromUser,
    updateShowStatus,
    updateShowProgress,
} = require("./handlers")

const PORT = 4000;
const app = express();

app.use(morgan("tiny"));
app.use(express.json());

app.post("/signUp", signUp);
app.post("/logIn", logIn);
app.post("/addShowToUser", addShowToUser);
app.post("/searchShow", searchShow);
app.post("/removeShowFromUser", removeShowFromUser);
app.patch("/updateShowStatus", updateShowStatus);
app.patch("/updateShowProgress", updateShowProgress);


app.get(/(.*)/, (req, res) => {
    res.status(404).json({
        status: 404,
        message: "This is obviously not what you are looking for!",
    });
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
