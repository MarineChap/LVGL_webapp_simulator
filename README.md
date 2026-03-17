# LVGL Simulator Web Dashboard

This dashboard is a **generic previewer** for the LVGL simulator. It is designed to be completely decoupled from the project's source code by using a dynamic discovery mechanism.

## 🏗️ Agnostic Architecture

Unlike traditional apps with hardcoded configurations, this dashboard uses a **Manifest-Driven Discovery** system:

1.  **Dynamic Manifest**: The app fetches `manifest.json` from the root on startup.
2.  **Zero Hardcoding**: Dropdowns for "Version" and "Flavor" are populated automatically based on what is found in the manifest.
3.  **Path Resolution**: Assets are loaded from a structured hierarchy: `/assets/{version}/{flavor}/lvgl_sim.js`.

### How to add a new version/flavor?
You never need to touch the React code. Simply:
- Add a new entry to the `manifest.json`.
- Upload the `.js` and `.wasm` files to the corresponding folder in `/assets/`.

## 🤖 CI/CD Automation

The provided GitHub Action (`.github/workflows/build_simulator.yml`) handles this automatically:
- It compiles the simulator for each flavor.
- It pushes the binaries to the `gh-pages` branch.
- It **automatically updates** the `manifest.json` to include the new version.

## 🛠️ Local Development

1.  **Run the React UI**:
    ```bash
    ./run_web_app.sh
    ```
### 2. Manual WASM Build (Simulator Release)
To compile the simulator for the web manually, you need the **Emscripten SDK (emsdk)** installed.

#### Prerequisites:
1.  **Install emsdk**: Follow the [official instructions](https://emscripten.org/docs/getting_started/downloads.html).
2.  **Activate Environment**:
    ```bash
    git clone https://github.com/emscripten-core/emsdk.git

    cd path/to/emsdk
    ./emsdk install latest
    ./emsdk activate latest
    source ./emsdk_env.sh
    ```

#### Build Command:
Once `emsdk` is in your path, use the provided helper script:
```bash
# General syntax: ./simulator/build_wasm.sh <flavor>
cd simulator
./build_wasm.sh azote
```
This generates `lvgl_sim.js` and `lvgl_sim.wasm` in `simulator/build_wasm_azote/`.

b#### Testing Locally:
To test your build in the web app locally:
1.  Copy the generated files to the web app's public assets:
    ```bash
    mkdir -p web_simulator/public/assets/local/azote
    cp simulator/build_wasm_azote/lvgl_sim.* web_simulator/public/assets/local/azote/
    ```
2.  Add a "local" entry to your `web_simulator/public/manifest.json`.
3.  Refresh the web app.

## 📂 Deployment

Pushing a git tag (e.g., `v1.2.0`) will trigger a full build and update the dashboard dynamically for all users.
