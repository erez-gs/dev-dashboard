import {
  type ChildProcessWithoutNullStreams,
  spawn,
  execSync,
} from "child_process";

export function runPythonScript(): void {
  const pythonProcess: ChildProcessWithoutNullStreams = spawn("python3", [
    "python-scripts/test.py",
  ]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

export function makeDashboardPortForward(): string {
  function runCommand(command: string): string {
    try {
      execSync(command, { stdio: "ignore" });
      return "";
    } catch (error) {
      const errorMessage = `Error executing command: ${error}\n`;
      console.error(errorMessage);
      return errorMessage;
    }
  }

  function killTcpPort(port: number): string {
    const msg = `Attempting to kill process on TCP port ${port}\n`;
    console.log(msg);
    return runCommand(`lsof -ti tcp:${port} | xargs kill 2> /dev/null || true`);
  }

  function portForwardPod(
    namespace: string,
    podStartsWith: string,
    localPort: number,
    remotePort: number
  ): string {
    const errorMsg = killTcpPort(localPort);
    if (errorMsg) return errorMsg;

    // ! Replace with you own kubectl path, to find it run `which kubectl`
    const kubectlFullPath: string = "/Users/example-username/.rd/bin/kubectl";

    const command: string = `${kubectlFullPath} get pods -n ${namespace} -o=name | grep '^pod/${podStartsWith}' | head -n 1 | sed 's/^pod\\///'`;
    try {
      const podName: string = execSync(command).toString().trim();
      if (!podName) throw new Error("No pod found");

      const portForwardMsg = `Starting port-forward for pod ${podName}\n`;
      console.log(portForwardMsg);
      return runCommand(
        `${kubectlFullPath} port-forward pod/${podName} ${localPort}:${remotePort} -n ${namespace} &`
      );
    } catch (error) {
      const failMsg = `Failed to retrieve pod starting with ${podStartsWith}\n`;
      return failMsg;
    }
  }

  function portForward(): string {
    const backendPortForwardErrorMsg: string = portForwardPod(
      "team13",
      "api-backend-deployment",
      50051,
      50051
    );
    if (backendPortForwardErrorMsg) return backendPortForwardErrorMsg;

    const postgresDashboardPortForwardErrorMsg: string = portForwardPod(
      "team13",
      "postgres-dashboard",
      5432,
      5432
    );
    if (postgresDashboardPortForwardErrorMsg) {
      return postgresDashboardPortForwardErrorMsg;
    }

    const timescaleDbPortForwardErrorMsg: string = portForwardPod(
      "team13",
      "timescaledb-single-0",
      5433,
      5432
    );
    if (timescaleDbPortForwardErrorMsg) return timescaleDbPortForwardErrorMsg;

    return "Port forwarding finished successfully";
  }

  return portForward();
}
