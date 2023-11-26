const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const db = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const PageNotFound404Controller = require("./controllers/404(PageNotFound)");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes.routes);
app.use(shopRoutes);

app.use(PageNotFound404Controller.get404PageNotFound);

app.listen(3000);
