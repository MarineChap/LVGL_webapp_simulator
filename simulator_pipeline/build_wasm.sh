#!/bin/bash

# Default flavor
FLAVOR=${1:-system1}
BUILD_DIR="build_wasm_${FLAVOR}"

echo "Building LVGL Simulator for Web (Flavor: ${FLAVOR})..."

# Check if emcc is available
if ! command -v emcc &> /dev/null
then
    echo "Error: emcc could not be found. Please install emsdk and source emsdk_env.sh."
    exit 1
fi

# Change to script directory so build happens in simulator/
cd "$(dirname "$0")"

# Create and enter build directory
mkdir -p ${BUILD_DIR}
cd ${BUILD_DIR}

# Run CMake with Emscripten toolchain
emcmake cmake .. -DSIM_FLAVOR=${FLAVOR}

# Build
emmake make -j$(nproc)

echo "Build complete! Output files are in ${BUILD_DIR}/"
ls -lh lvgl_sim.js lvgl_sim.wasm
