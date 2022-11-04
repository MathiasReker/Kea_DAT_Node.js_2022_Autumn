import express from "express";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

import pokemonRouter from "./routers/pokemonRouter.js";
app.use(pokemonRouter);
import battleRouter from "./routers/battleRouter.js";
app.use(battleRouter.router);
import battleResultsRouter from "./routers/battleResultsRouter.js";
app.use(battleResultsRouter);
import contactRouter from "./routers/contactRouter.js";
app.use(contactRouter);

import { renderPage, injectData } from "./util/templateEngine.js";

import { mailer } from "./util/mailer.js"

const frontpagePage = renderPage("/frontpage/frontpage.html", 
{ 
    tabTitle: "Pokemon", 
    cssLink: `<link rel="stylesheet" href="/pages/frontpage/frontpage.css">` 
});

const battlePage = renderPage("/battle/battle.html", {
    cssLink: `<link rel="stylesheet" href="/pages/battle/battle.css">` 
});

const battleResultsPage = renderPage("/battleResults/battleResults.html");

const contactPage = renderPage("/contact/contact.html");

app.get("/", (req, res) => {
    sendMail();
    res.send(frontpagePage);
});

const randomPokemon = ["pikachu", "slowpoke", "ditto"];
app.get("/battle", (req, res) => {   
    res.redirect(`battle/${randomPokemon[Math.floor(Math.random() * randomPokemon.length)]}`);
});

app.get("/battle/:pokemonName", (req, res) => {
    const pokemonName = req.params.pokemonName;
    const battlePageWithData = injectData(battlePage, { pokemonName });
    res.send(battlePageWithData.replace("%%TAB_TITLE%%", `Battle ${req.params.pokemonName}`));
});

app.get("/battleResults", (req, res) => {
    res.send(battleResultsPage);
});

app.get("/contact", (req, res) => {
    res.send(contactPage);
});



const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});


function addA(someString) {
    return someString + "A";
}

const sendMail = async () => {
    const infoMail = {
        from: '"app" <app@example.com>',
        to: "app@example.com",
        subject: "The frontpage was loaded...",
        text: "A user has entered the front page",
        html: "<p>A user has entered the front page</p>",
    };

    await mailer(infoMail).then(response => {
        console.log(response.messageId || 'failed');
    });
}
