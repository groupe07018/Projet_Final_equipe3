const {createClient} = require("@libsql/client")

module.exports = createClient({
    url: "file:bd_projet.db"
})
