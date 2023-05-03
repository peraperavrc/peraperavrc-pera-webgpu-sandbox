async function example(canvas, deviceType) {
  const gfxOptions = {   // グラフィックスデバイスのオプションを設定
    deviceTypes: [deviceType], // デバイスタイプを設定
    glslangUrl: "./static/lib/glslang/glslang.js", // glslang を読み込む
    twgslUrl: "./static/lib/twgsl/twgsl.js", // twgsl を読み込む
  };

  const device = await pc.createGraphicsDevice(canvas, gfxOptions);   // グラフィックスデバイスを作成
  const createOptions = new pc.AppOptions();   // アプリケーションオプションを設定
  createOptions.graphicsDevice = device; // グラフィックスデバイスを設定

  if (device.deviceType === "webgpu") {   // WebGPU が有効な場合、テキストを表示

    document.getElementById("webgpu-enabled").innerText = "WebGPU が有効";
  }
  createOptions.componentSystems = [   // レンダリング、カメラ、ライトのコンポーネントシステムを追加
    pc.RenderComponentSystem,
    pc.CameraComponentSystem,
    pc.LightComponentSystem,
  ];

  createOptions.resourceHandlers = [pc.TextureHandler, pc.ContainerHandler];   // テクスチャとコンテナのハンドラを追加

  const app = new pc.AppBase(canvas); // アプリケーションを作成
  app.init(createOptions); // アプリケーションを初期化

  app.start(); // アプリケーションループを開始

  app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW); // キャンバスをウィンドウに合わせる
  app.setCanvasResolution(pc.RESOLUTION_AUTO); // 画面サイズに合わせて解像度を変更する

  // カメラエンティティを作成
  const camera = new pc.Entity("camera"); // 新しいエンティティを作成
  camera.addComponent("camera", {
    // カメラコンポーネントを追加
    clearColor: new pc.Color(1, 0.6, 0.6), // クリアカラーをピンクに設定
  });

  app.root.addChild(camera); // カメラを階層に追加

  camera.setPosition(0, 0, 3); // カメラの位置を設定

  const light = new pc.Entity("light"); // ディレクショナルライトを作成

  light.addComponent("light");
  app.root.addChild(light);
  light.setEulerAngles(45, 0, 0);

  const url = "/assets/peravillage.glb";
  let isLoadedPera = false; // モデルが読み込まれたかどうかを示すフラグ
  pc.app.assets.loadFromUrl(url, "container", (err, asset) => {
    const container = asset.resource.instantiateRenderEntity(); // Entityを作成
    const entity = container.children[0]; // コンテナー内のEntityを取得
    app.root.addChild(entity); // Entityをシーンに追加
    entity.name = "Pera"; // Entityに名前を付ける
    isLoadedPera = true; //フラグを立てる
  });

  app.on("update", (dt) => {     // 前回のフレームからのデルタ時間に応じてボックスを回転させる
    if (isLoadedPera) {
      const pera = app.root.findByName("Pera"); // Entityを取得
      pera.rotate(0, 30 * dt, 0); // 回転させる
    }
  });
}

(async () => {
  const canvas = document.getElementById("application-canvas");
  const deviceType = "webgpu";
  example(canvas, deviceType);
})();
