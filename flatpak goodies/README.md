# Installation Guide for Mesa Git Extension

This guide covers how to install the `mesa-git` extensions directly from the local repository folders included in this project.

## Prerequisites

Before starting, ensure you have `flatpak` installed on your system:

```bash
sudo apt update && sudo apt install flatpak -y
```

---

## Installation Steps

### 1. Navigate to the Folders
Open your terminal and navigate to the directory where your local repositories are located:
```bash
cd video_driver_debian/"flatpak goodies"
```

### 2. Install the 64-bit GL Extension
Run the following command to install the standard 64-bit extension directly from the `repo_amd64` folder:
```bash
flatpak install ./repo_amd64 org.freedesktop.Platform.GL.mesa-git
```

### 3. Install the 32-bit GL32 Extension
Run the following command to install the 32-bit compatibility extension directly from the `repo_i386` folder:
```bash
flatpak install ./repo_i386 org.freedesktop.Platform.GL32.mesa-git
```

---

## Verification & Usage

### Verify Installation
To confirm that both extensions were successfully added to your system, run:
```bash
flatpak list --runtime
```
Look for `org.freedesktop.Platform.GL.mesa-git` and `org.freedesktop.Platform.GL32.mesa-git` in the output list.

### Force Applications to Use the Git Extension
To force a flatpak application (like Sober) to use your newly installed Git drivers instead of the system default, run it with this environment variable override:

```bash
FLATPAK_GL_MODIFIERS=mesa-git flatpak run org.vinegarhq.Sober
```
