module.exports = {
    middleware: async (req, res, next) => {
        const session = req.cookies.session;

        if(!session) {
            next();
            return;
        }

        const result = await db.excute({
            sql: "SELECT * FROM session WHERE id = :session",
            args: { session }
        });

        req.session = result.rows[0];
        next();
    },

    createSession: async (res) => {
        let uuid = crypto.randomUUID();
        while(
            (await db.execute({
                sql: "SELECT 1 FROM session WHERE id = :uuid",
                args: { uuid }
                })
            ).rows.length > 0
        ) {
            uuid = crypto.randomUUID();
        }

        db.execute({
            sql: "INSERT INTO session (id) VALUES (:uuid)",
            args: { uuid }
        });

        res.cookie("session", uuid);

        return uuid;
    },

    addInfo: (sessionId, info) => {
        db.execute({
            sql: "UPDATE session SET " + Object.entries(info)
            .map((x) => x[0] + " = :" + x[0])
            .join(", ") +
            " WHERE id = :sessionId;",
            args: {...info, sessionInfo}
        });
    },
};