---
title: Build Debian Sid Rootfs for PS4
description: Step-by-step guide to bootstrapping, configuring, and packing a custom Debian Sid tar.xz image for PS4 Linux.
---

# Build a Debian Sid tarball for PS4

This guide walks through building a clean Debian Sid (`unstable`) root filesystem using `debootstrap` and `chroot`, installing custom PS4 video drivers and a desktop environment, and packing it into a `psxitarch.tar.xz` archive ready for installation.

::: info Windows Users
If you are not currently running a native Linux system, install **Windows Subsystem for Linux (WSL)** first. Open PowerShell or Command Prompt as Administrator and run:
```powershell
wsl --install
```
Restart your PC if prompted, get a distribution from Microsoft Store (preferably Debian), open your distribution's WSL terminal (you can probably find it in the start menu), and follow the steps below inside WSL.
:::

## 1. Install Host Prerequisites

On your host Linux environment (or WSL), install `debootstrap`, `arch-install-scripts` (for `genfstab` and `arch-chroot`), and `xz-utils`:

```bash
sudo apt update
sudo apt install -y debootstrap arch-install-scripts xz-utils wget
```

## 2. Bootstrap Debian Sid

Create a working directory for your root filesystem and bootstrap a base `amd64` Debian Sid installation:

```bash
mkdir -p ~/debian-root
sudo debootstrap --arch=amd64 sid ~/debian-root http://deb.debian.org/debian/
```

## 3. Mount Virtual Filesystems & Enter Chroot

Mount `/dev`, `/proc`, and `/sys` into your new root filesystem and enter the `chroot` environment:

```bash
sudo mount --bind /dev ~/debian-root/dev
sudo mount --bind /dev/pts ~/debian-root/dev/pts
sudo mount -t proc /proc ~/debian-root/proc
sudo mount -t sysfs /sys ~/debian-root/sys
sudo chroot ~/debian-root /bin/bash
```

*(All commands in Steps 4 through 9 are executed **inside** the chroot environment.)*

## 4. Configure Hostname, Locales & Base Tools

Set up a hostname, generate locales, and install essential utilities (`sudo`, `wget`, `ca-certificates`, `network-manager`):

```bash
echo "host_name_i_want" > /etc/hostname

apt update
apt install -y locales sudo wget ca-certificates gnupg network-manager dbus-x11

sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
echo "LANG=en_US.UTF-8" > /etc/locale.conf
```

## 5. Install Custom PS4 Video Drivers (Mesa & libdrm)

Follow **every single step** (Steps 1 through 8) from the [Video Runtime - Debian Repository README](https://github.com/ilovegangstarap/video_driver_debian/blob/main/README.md) to enable `i386` multi-arch, configure `dpkg` overwrites, add the GPG key and APT repository, install the custom Mesa/libdrm packages, hold their versions, and configure APT pinning.

::: warning Mandatory Step
Do not skip the `apt-mark hold` or APT pinning steps in that guide—standard `apt upgrade` runs will otherwise overwrite the custom PS4 graphics stack with broken upstream packages.
:::

## 6. Install a Desktop Environment

Choose **one** of the following desktop environments and install it along with a display manager (such as SDDM):

::: code-group
```bash [KDE Plasma]
apt install -y plasma-desktop plasma-nm plasma-pa plasma-login-manager konsole dolphin
```

```bash [LXQt (Lightweight)]
apt install -y lxqt sddm qterminal pcmanfm-qt
```
:::

Enable SDDM and NetworkManager so they start automatically on boot:

```bash
systemctl enable (sddm or plasmalogin, whichever you installed)
systemctl enable NetworkManager
```

## 7. Create a User with `sudo` & Skeleton Configs

Create your administrative user account with a home directory populated from `/etc/skel` (`-m -k /etc/skel`), assign `/bin/bash`, add them to the `sudo` and hardware groups, and set a password:

```bash
useradd -m -k /etc/skel -s /bin/bash -G sudo,video,audio,plugdev username_i_want
passwd username_i_want
passwd root
```

*(Replace `username_i_want` with your preferred username. Also set a `root` password if desired using `passwd`.)*

Verify that your user's home folder inherited the skeleton files and has proper ownership:

```bash
chown -R username_i_want:username_i_want /home/username_i_want
ls -la /home/username_i_want
```

## 8. Clean Up APT Cache & Exit Chroot

Remove cached `.deb` archives to keep your final image small, then exit the `chroot` and unmount the virtual filesystems:

```bash
apt clean
rm -rf /var/lib/apt/lists/*
exit
```

Back on your host system, unmount the bound directories:

```bash
sudo umount ~/debian-root/dev/pts
sudo umount ~/debian-root/dev
sudo umount ~/debian-root/proc
sudo umount ~/debian-root/sys
```

## 9. Pack the Rootfs into `psxitarch.tar.xz`

Navigate **inside** the root filesystem directory so files are archived relative to `./` (and not nested inside a top-level folder), then compress using multithreaded XZ compression while preserving root ownership:

```bash
cd ~/debian-root
sudo tar \
  --one-file-system \
  --acls \
  --xattrs \
  --numeric-owner \
  --exclude='./proc/*' \
  --exclude='./sys/*' \
  --exclude='./dev/*' \
  --exclude='./run/*' \
  --exclude='./tmp/*' \
  --exclude='./var/tmp/*' \
  --exclude='./var/cache/*' \
  --exclude='./var/log/*' \
  --exclude='./swapfile' \
  --exclude='./lost+found' \
  --exclude='./mnt/*' \
  --exclude='./media/*' \
  --exclude='./psxitarch.tar.xz' \
  -cvpf ./psxitarch.tar.xz ./* -I "xz -T0 -9e"
```

Once complete, go to [DionKill's guide](https://dionkill.github.io/ps4-linux-tutorial/) and follow as normal.
