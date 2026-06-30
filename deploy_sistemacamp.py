#!/usr/bin/env python3
import datetime
import os
import sys

import paramiko

HOST = "138.16.225.102"
USER = "root"
KEY_FILE = "/Users/bul82/.ssh/catalog_zoj_vps"
PROJECT_NAME = "sistemacamp"
LOCAL_DIR = "/Users/bul82/Documents/sistemacamp"


def run_command_over_ssh(ssh_client, cmd):
    stdin, stdout, stderr = ssh_client.exec_command(cmd)
    exit_status = stdout.channel.recv_exit_status()
    out_text = stdout.read().decode().strip()
    err_text = stderr.read().decode().strip()
    if exit_status != 0:
        print(f"Command failed with exit code {exit_status}: {cmd}")
        if err_text:
            print(err_text)
    return exit_status, out_text, err_text


def upload_dir(sftp, local_dir, remote_dir):
    for root, _, files in os.walk(local_dir):
        rel_root = os.path.relpath(root, local_dir)
        target_root = remote_dir if rel_root == "." else f"{remote_dir}/{rel_root}"
        for filename in files:
            local_path = os.path.join(root, filename)
            remote_path = f"{target_root}/{filename}"
            sftp.put(local_path, remote_path)


def deploy():
    print("=== Sistema Camp landing VPS deployment ===")

    try:
        proxy = paramiko.ProxyCommand(f"nc -b en0 {HOST} 22")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        pkey = paramiko.Ed25519Key.from_private_key_file(KEY_FILE)
        ssh.connect(hostname=HOST, username=USER, pkey=pkey, sock=proxy, timeout=15)
    except Exception as exc:
        print(f"SSH connection failed: {exc}")
        sys.exit(1)

    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    remote_base_dir = f"/var/www/landings/{PROJECT_NAME}"
    remote_release_dir = f"{remote_base_dir}/releases/{timestamp}"

    run_command_over_ssh(ssh, f"mkdir -p {remote_release_dir}/assets")

    try:
        sftp = ssh.open_sftp()
        for filename in ["index.html", "styles.css", "script.js"]:
            sftp.put(os.path.join(LOCAL_DIR, filename), f"{remote_release_dir}/{filename}")
        upload_dir(sftp, os.path.join(LOCAL_DIR, "assets"), f"{remote_release_dir}/assets")
        sftp.close()
    except Exception as exc:
        print(f"SFTP upload failed: {exc}")
        ssh.close()
        sys.exit(1)

    current_symlink = f"{remote_base_dir}/current"
    exit_status, _, _ = run_command_over_ssh(ssh, f"ln -sfn releases/{timestamp} {current_symlink}")
    if exit_status != 0:
        ssh.close()
        sys.exit(1)

    run_command_over_ssh(ssh, f"chown -R www-data:www-data {remote_base_dir}")
    ssh.close()

    print("Deployment completed.")
    print(f"Live URL: https://bul82info.ru/{PROJECT_NAME}/")


if __name__ == "__main__":
    deploy()
