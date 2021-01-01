const inquirer = require("inquirer");
const questions = require("./questions.js");
const subnet = require("./subnet.js");

inquirer.prompt(questions).then((answers) => {
    const { networkClass, IP_Address, subnet } = answers;
    console.log(networkClass, IP_Address, subnet);
});
