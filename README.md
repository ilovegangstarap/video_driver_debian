# Video Runtime - Debian Repository

This repository provides custom, pre-compiled Mesa and DRM graphic driver packages (Mesa version `26.0.8-1` and libdrm version `2.4.134-3`) as provided by [DionKill](https://github.com/DionKill/ps4-video-archlinux) built for Debian Sid based environments. It includes full multi-arch (`amd64` and `i386`) library support for running high-performance graphics, Steam, Proton, and Wine applications.

## Installation Guide

Follow these steps to add the trusted GPG signing key, register the custom repository mirror, and install the exact versions of the driver stack.

### 1. Enable 32-bit Architecture Support
You are running a 64-bit operating system, ensure your package manager is configured to handle 32-bit (`i386`) dependencies:
```bash
sudo dpkg --add-architecture i386
```

### 2. Configure Dpkg for Overwrites
To prevent the installation from halting due to standard package conflicts, explicitly configure `dpkg` to allow forcing file overwrites:
```bash
echo "force-overwrite" | sudo tee -a /etc/dpkg/dpkg.cfg
```

### 3. Import the Repository GPG Key
Download and import the trusted repository public signing key to your system's secure keyring directory:
```bash
sudo wget -O /etc/apt/keyrings/video.asc https://github.com/ilovegangstarap/video_driver_debian/raw/refs/heads/main/public.gpg
```

### 4. Register the Custom Repository
Add the repository source definition to your system's package source listings:
```bash
echo "deb [arch=amd64,i386 signed-by=/etc/apt/keyrings/video.asc] https://ilovegangstarap.github.io/video_driver_debian/debian ./" | sudo tee /etc/apt/sources.list.d/video.list
```

### 5. Update Package Directories
Resynchronize your system index files to pull the package listings from the newly added mirror:
```bash
sudo apt update
```

### 6. Install the Native & Multi-Arch Drivers
Install all runtime libraries, development headers, and kernel interfacing modules simultaneously to align your graphics framework to these exact custom versions:

```bash
sudo apt install \
  libdrm2:amd64=2.4.134-3 libdrm2:i386=2.4.134-3 \
  libdrm-amdgpu1:amd64=2.4.134-3 libdrm-amdgpu1:i386=2.4.134-3 \
  libdrm-common=2.4.134-3 \
  libdrm-dev:amd64=2.4.134-3 \
  libdrm-radeon1:amd64=2.4.134-3 libdrm-radeon1:i386=2.4.134-3 \
  libdrm-tests:amd64=2.4.134-3 \
  libegl-mesa0:amd64=26.0.8-1 libegl-mesa0:i386=26.0.8-1 \
  libgbm1:amd64=26.0.8-1 libgbm1:i386=26.0.8-1 \
  libgbm-dev:amd64=26.0.8-1 libgbm-dev:i386=26.0.8-1 \
  libgl1-mesa-dev:amd64=26.0.8-1 libgl1-mesa-dev:i386=26.0.8-1 \
  libgl1-mesa-dri:amd64=26.0.8-1 libgl1-mesa-dri:i386=26.0.8-1 \
  libgles2-mesa-dev:amd64=26.0.8-1 libgles2-mesa-dev:i386=26.0.8-1 \
  libglx-mesa0:amd64=26.0.8-1 libglx-mesa0:i386=26.0.8-1 \
  mesa-common-dev:amd64=26.0.8-1 mesa-common-dev:i386=26.0.8-1 \
  mesa-drm-shim:amd64=26.0.8-1 mesa-drm-shim:i386=26.0.8-1 \
  mesa-libgallium:amd64=26.0.8-1 mesa-libgallium:i386=26.0.8-1 \
  mesa-opencl-icd:amd64=26.0.8-1 mesa-opencl-icd:i386=26.0.8-1 \
  mesa-vulkan-drivers:amd64=26.0.8-1 mesa-vulkan-drivers:i386=26.0.8-1
```

### 7. Lock Driver Versions (Highly Recommended)
Because these packages share package names with upstream system mirrors, a standard `sudo apt upgrade` could overwrite them. Lock these packages at their current versions to prevent accidental regression or system library mismatch:

```bash
sudo apt-mark hold \
  libdrm2 libdrm2:i386 \
  libdrm-amdgpu1 libdrm-amdgpu1:i386 \
  libdrm-common \
  libdrm-dev libdrm-dev:i386 \
  libdrm-radeon1 libdrm-radeon1:i386 \
  libdrm-tests libdrm-tests:i386 \
  libegl-mesa0 libegl-mesa0:i386 \
  libgbm1 libgbm1:i386 \
  libgbm-dev libgbm-dev:i386 \
  libgl1-mesa-dev libgl1-mesa-dev:i386 \
  libgl1-mesa-dri libgl1-mesa-dri:i386 \
  libgles2-mesa-dev libgles2-mesa-dev:i386 \
  libglx-mesa0 libglx-mesa0:i386 \
  mesa-common-dev mesa-common-dev:i386 \
  mesa-drm-shim mesa-drm-shim:i386 \
  mesa-libgallium mesa-libgallium:i386 \
  mesa-opencl-icd mesa-opencl-icd:i386 \
  mesa-vulkan-drivers mesa-vulkan-drivers:i386
```
