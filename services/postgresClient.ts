import { promises as fs } from "fs";
import path from "path";
import { Client } from "pg";
import { exit } from "process";

const dbScriptsFolder = path.join(process.cwd(), "dbScripts");

const pgClient = (function () {
  let instance: Client;

  function createInstance() {
    const connectionString =
      "postgresql://myuser:mypassword@localhost:5432/mydatabase";

    try {
      instance = new Client({ connectionString });
    } catch (error) {}

    function connect() {
      instance.connect().then(() => {
        //  log.info("Connected to PostgreSQL database ", connectionString);
      });
      // .catch((error) => {
      //   // log.error(
      //   //   "Error connecting to PostgreSQL with connection string:" +
      //   //     connectionString,
      //   //   error
      //   // );

      //   // log.info("Attempting to reconnect in 5 seconds...");
      //   setTimeout(connect, 5000);
      // });
    }

    // Initial connection
    connect();

    instance.on("end", () => {
      // Reconnect when the connection is closed unexpectedly
      // log.info(
      //   "Connection to PostgreSQL database closed unexpectedly. Reconnecting..."
      // );
      connect();
    });

    return instance;
  }

  function disconnect() {
    if (instance) {
      instance.end();
      // log.info("Disconnected from PostgreSQL database");
    }
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
    disconnect,
  };
})();

export default pgClient;

export async function pgRunScript(scriptName: string) {
  const script = await fs.readFile(
    `${dbScriptsFolder}/${scriptName}.sql`,
    "utf8"
  );

  return pgClient.getInstance().query(script);
}

// Set up a signal handler for SIGTERM
process.on("SIGTERM", async () => {
  //log.info("Received SIGTERM signal. Performing cleanup...");

  // Call the disconnect function to disconnect from PostgreSQL
  pgClient.disconnect();

  // Exit the application
  exit(0);
});
