const  signUp  = require("./handlers/signUp");
const  logIn  =require("./handlers/logIn");
const addShowToUser = require("./handlers/addShowToUser");
const searchShow = require("./handlers/searchShow");
const removeShowFromUser = require("./handlers/removeShowFromUser");
const updateShowStatus = require("./handlers/updateShowStatus");
const updateShowProgress = require("./handlers/updateShowProgress");

module.exports = {
    signUp,
    logIn,
    addShowToUser,
    searchShow,
    removeShowFromUser,
    updateShowStatus,
    updateShowProgress,
}