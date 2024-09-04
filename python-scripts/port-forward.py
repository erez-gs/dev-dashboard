import subprocess
import os
import sys

def run_command(command):
    try:
        subprocess.run(command, check=True, shell=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {e}")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

def kill_tcp_port(port):
    print(f"Attempting to kill process on TCP port {port}")
    return run_command(f"lsof -ti tcp:{port} | xargs kill 2> /dev/null || true")

def port_forward_pod(namespace, pod_starts_with, local_port, remote_port):
    if not kill_tcp_port(local_port):
        return False
    command = f"kubectl get pods -n {namespace} -o=name | grep '^pod/{pod_starts_with}' | head -n 1 | sed 's/^pod\\///'"
    try:
        pod_name = subprocess.check_output(command, shell=True).decode().strip()
        if pod_name:
            print(f"Starting port-forward for pod {pod_name}")
            if run_command(f"kubectl port-forward pod/{pod_name} {local_port}:{remote_port} -n {namespace} &"):
                return True
            else:
                return False
        else:
            print(f"No pod found starting with {pod_starts_with}")
            return False
    except subprocess.CalledProcessError:
        print(f"Failed to retrieve pod starting with {pod_starts_with}")
        return False

def port_forward():
    success = True
    if not port_forward_pod("team13", "di-t", 6090, 6090):
        success = False

    return success

def disable_port_forward():
    if kill_tcp_port(50051) and kill_tcp_port(5432) and kill_tcp_port(5433):
        print("Successfully disabled all port forwards.")
        return True
    else:
        print("Failed to disable all port forwards.")
        return False

def test_service():
    print("No tests for this service")
    return True

if __name__ == '__main__':
    if port_forward():
        sys.exit(0)  
    else:
        sys.exit(1)  