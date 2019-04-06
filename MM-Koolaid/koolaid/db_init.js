/**
 * DB reset script for a controlled test environment.
 * Take a look at this if you want the schema, no need
 * to login to Postgres.
 * Run separately from the rest of the app.
 */

const { Pool } = require("pg");

const pool = new Pool({
  user: "MuchToKnow",
  host: "minutes-made.cvt0ckrxsc9j.us-east-2.rds.amazonaws.com",
  database: "Minutes",
  password: "MinuteMan",
  port: 5432
});

const db = {
  query: async (text, params) => {
    const start = Date.now();
    let res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("executed query", { text, duration, rows: res.rowCount });
  }
};

reset = async () => {
  await db.query(
    `DROP TABLE IF EXISTS "users", "org", "user_in_org", "user_admin_org", "meeting", "user_in_org_in_meeting" CASCADE`
  );

  await db.query(`CREATE TABLE "users"
    (
      userid        SERIAL,
      firstname     VARCHAR(45),
      lastname      VARCHAR(45),
      email         VARCHAR(45) NOT NULL UNIQUE,
      password      CHAR(60) NOT NULL,
      country       CHAR(2),
      language      CHAR(2),
      registerdate    BIGINT,
      lastlogin     BIGINT,

      PRIMARY KEY (userid)
    );`);

  await db.query(`CREATE TABLE "org"
    (
      orgid        SERIAL,
      orgname      VARCHAR(45),
      address       VARCHAR(100),
      city          VARCHAR(100),
      country       CHAR(2),
      zipcode       VARCHAR(10),

      PRIMARY KEY (orgid)
    );`);

  await db.query(`CREATE TABLE "user_in_org"
  (
    userid        INT,
    orgid         INT,
    joindate      BIGINT,

    PRIMARY KEY (userid, orgid),
    FOREIGN KEY (userid) REFERENCES "users"(userid)
      ON DELETE CASCADE,
    FOREIGN KEY (orgid) REFERENCES "org"(orgid)
      ON DELETE CASCADE
  );`);

  await db.query(`CREATE TABLE "user_admin_org"
    (
      userid      INT,
      orgid       INT,
      joindate    BIGINT,

      PRIMARY KEY (userid, orgid),
      FOREIGN KEY (userid) REFERENCES "users"(userid)
        ON DELETE CASCADE,
      FOREIGN KEY (orgid) REFERENCES "org"(orgid)
        ON DELETE CASCADE
    );`);

  await db.query(`CREATE TABLE "meeting"
    (
      meetingid           SERIAL,
      transcript          VARCHAR(10485760),
      scheduledstarttime  BIGINT,
      scheduledendtime    BIGINT,
      starttime           BIGINT,
      endtime             BIGINT,
      active              BOOLEAN DEFAULT false,
      containerid         VARCHAR(256),

      PRIMARY KEY (meetingid)
    );`);

  await db.query(`CREATE TABLE  "user_in_org_in_meeting"
    (
      userid INT NOT NULL,
      meetingid INT NOT NULL,
      orgid INT,

      PRIMARY KEY (userid, meetingid, orgid),
      FOREIGN KEY (userid) REFERENCES "users"(userid)
        ON DELETE CASCADE,
      FOREIGN KEY (orgid) REFERENCES "org"(orgid)
        ON DELETE SET NULL
    );`);

  /**
   * Populate the tables.
   */
  const d = new Date();
  const epochSeconds = Math.round(d.getTime() / 1000);

  await db.query(
    `INSERT INTO "users" (firstname, lastname, email, password, country, registerdate, lastlogin)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [
      "YuMing",
      "He",
      "yumingh7@gmail.com",
      "$2y$12$YYWw9Auq9gppEiotER4iBenjV.dXbY1Tr8Ol.JcRdw9BESSKH2zUa",
      "ca",
      epochSeconds,
      epochSeconds
    ]
  );

  await db.query(
    `INSERT INTO "users" (firstname, lastname, email, password, country, registerdate, lastlogin)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [
      "Justin",
      "Derwee-Church",
      "firepower789@gmail.com",
      "$2y$12$YYWw9Auq9gppEiotER4iBenjV.dXbY1Tr8Ol.JcRdw9BESSKH2zUa",
      "ca",
      epochSeconds,
      epochSeconds
    ]
  );

  await db.query(
    `INSERT INTO "users" (firstname, lastname, email, password, country, registerdate, lastlogin)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [
      "Eric",
      "Mikulin",
      "ericm99@gmail.com",
      "$2y$12$YYWw9Auq9gppEiotER4iBenjV.dXbY1Tr8Ol.JcRdw9BESSKH2zUa",
      "ca",
      epochSeconds,
      epochSeconds
    ]
  );

  await db.query(
    `INSERT INTO "users" (firstname, lastname, email, password, country, registerdate, lastlogin)
      VALUES($1, $2, $3, $4, $5, $6, $7)`,
    [
      "Harry",
      "Yao",
      "harryyao13@gmail.com",
      "$2y$12$YYWw9Auq9gppEiotER4iBenjV.dXbY1Tr8Ol.JcRdw9BESSKH2zUa",
      "ca",
      epochSeconds,
      epochSeconds
    ]
  );

  await db.query(
    `INSERT INTO "org" (orgname, address, city, country, zipcode)
      VALUES($1, $2, $3, $4, $5)`,
    ["Minutes Made", "1102-5782 Berton Ave", "Vancouver", "ca", "V6S0C1"]
  );

  await db.query(
    `INSERT INTO "user_in_org" (userid, orgid, joindate)
      VALUES($1, $2, $3)`,
    [1, 1, epochSeconds]
  );

  await db.query(
    `INSERT INTO "user_in_org" (userid, orgid, joindate)
      VALUES($1, $2, $3)`,
    [2, 1, epochSeconds]
  );

  await db.query(
    `INSERT INTO "user_in_org" (userid, orgid, joindate)
      VALUES($1, $2, $3)`,
    [3, 1, epochSeconds]
  );

  await db.query(
    `INSERT INTO "user_in_org" (userid, orgid, joindate)
      VALUES($1, $2, $3)`,
    [4, 1, epochSeconds]
  );

  //Grant read/write to app user on all re-built tables
  await db.query(`
  GRANT SELECT ON TABLE public.users TO app;
  GRANT INSERT ON TABLE public.users TO app;
  GRANT UPDATE ON TABLE public.users TO app;
  GRANT SELECT ON TABLE public.org TO app;
  GRANT INSERT ON TABLE public.org TO app;
  GRANT UPDATE ON TABLE public.org TO app;
  GRANT SELECT ON TABLE public.user_in_org TO app;
  GRANT INSERT ON TABLE public.user_in_org TO app;
  GRANT UPDATE ON TABLE public.user_in_org TO app;
  GRANT SELECT ON TABLE public.user_admin_org TO app;
  GRANT INSERT ON TABLE public.user_admin_org TO app;
  GRANT UPDATE ON TABLE public.user_admin_org TO app;
  GRANT SELECT ON TABLE public.meeting TO app;
  GRANT INSERT ON TABLE public.meeting TO app;
  GRANT UPDATE ON TABLE public.meeting TO app;
  GRANT SELECT ON TABLE public.user_in_org_in_meeting TO app;
  GRANT INSERT ON TABLE public.user_in_org_in_meeting TO app;
  GRANT UPDATE ON TABLE public.user_in_org_in_meeting TO app;
  `);
};

reset()
  .then(() => {
    console.log("Database was successfully reset.");
  })
  .catch(e => {
    console.log("Something went wrong: " + e);
  });
