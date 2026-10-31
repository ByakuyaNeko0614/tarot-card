/* Dependency-free Chrome integration check: node tools/browser-check.cjs */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { once } = require('node:events');

async function main() {
  const chromePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if (!fs.existsSync(chromePath)) throw new Error('Set CHROME_PATH to a Chrome/Chromium executable.');
  const root = path.resolve(__dirname, '../塔羅牌');
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tarot-browser-check-'));
  const output = path.resolve(__dirname, '../artifacts');
  fs.mkdirSync(output, { recursive: true });
  const server = http.createServer((req, res) => {
    try {
      const requestPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, '.' + (requestPath === '/' ? '/index.html' : requestPath));
      if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' };
      const body = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  let browser;
  let socket;
  try {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    browser = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
    const endpoint = await new Promise((resolve, reject) => {
      let log = '';
      const timeout = setTimeout(() => reject(new Error('Chrome startup timeout: ' + log.slice(-1500))), 15000);
      browser.on('error', reject);
      browser.stderr.on('data', chunk => {
        log += chunk.toString();
        const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (match) { clearTimeout(timeout); resolve(match[1]); }
      });
    });
    const address = new URL(endpoint);
    const tabs = await fetch(`http://${address.host}/json/list`).then(response => response.json());
    socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
    await once(socket, 'open');
    let sequence = 0;
    const pending = new Map();
    const errors = [];
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const task = pending.get(message.id);
        if (!task) return;
        pending.delete(message.id);
        if (message.error) task.reject(new Error(message.error.message)); else task.resolve(message.result);
      }
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(JSON.stringify(message.params.args));
    });
    const call = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const origin = `http://127.0.0.1:${server.address().port}`;
    const navigate = async () => {
      await call('Page.navigate', { url: origin });
      for (let i = 0; i < 200; i++) {
        if (await evaluate('document.readyState === "complete" && !!document.querySelector(".tarot-card")')) return;
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      throw new Error('Page load timed out');
    };
    const screenshot = async name => {
      // Capture the settled flip, rather than a frame in the middle of rotation.
      await evaluate('Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})))');
      const shot = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      fs.writeFileSync(path.join(output, name), Buffer.from(shot.data, 'base64'));
    };
    await call('Page.enable');
    await call('Runtime.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: 1365, height: 1500, deviceScaleFactor: 1, mobile: false });
    if (process.argv.includes('--preview')) {
      // Fast visual iteration using the original 22 faces while new art is prepared.
      await call('Page.addScriptToEvaluateOnNewDocument', { source: 'localStorage.setItem("tarot-deck", "major");' });
      await navigate();
      await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
      await evaluate('document.getElementById("question").value = "我該如何規劃下一步？"; document.querySelector("input[value=three]").click(); document.querySelectorAll(".tarot-card")[0].click(); document.querySelectorAll(".tarot-card")[2].click(); document.querySelectorAll(".tarot-card")[4].click()');
      await screenshot('mobile-preview-dark-zh.png');
      await evaluate('document.getElementById("language").value = "en"; document.getElementById("language").dispatchEvent(new Event("change")); document.getElementById("themeBtn").click()');
      await screenshot('mobile-preview-light-en.png');
      console.log('Mobile layout previews saved to artifacts/. This mode does not run the full browser checks.');
      await call('Browser.close');
      return;
    }
    await navigate();
    assert.deepEqual(await evaluate('[document.documentElement.lang, document.documentElement.dataset.theme, document.querySelectorAll(".tarot-card").length]'), ['zh-Hant', 'dark', 6]);
    assert.equal(await evaluate('document.querySelector("#language option[value=zh]").textContent'), 'Chinese');
    assert.equal(await evaluate('document.getElementById("deckType").value'), 'full');
    assert.equal(await evaluate('document.getElementById("copyBtn").disabled'), true);
    assert.equal(await evaluate('document.getElementById("interpretationTools").hidden'), true);
    assert.equal(await evaluate('document.getElementById("stepQuestion").getAttribute("aria-current")'), 'step');
    await screenshot('desktop-redesign-empty.png');
    await evaluate('document.querySelector(".tarot-card").click()');
    assert.equal(await evaluate('document.getElementById("question").getAttribute("aria-invalid")'), 'true');
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 0);
    assert.equal(await evaluate('document.getElementById("questionError").hidden'), false);
    await evaluate('document.querySelector("[data-question=ideaGrowth]").click()');
    assert.ok((await evaluate('document.getElementById("question").value')).includes('照顧自己'));
    assert.equal(await evaluate('document.getElementById("questionError").hidden'), true);
    assert.equal(await evaluate('document.getElementById("stepDraw").getAttribute("aria-current")'), 'step');
    const loaded = await evaluate('Promise.all(Tarot.deck.map(card => new Promise(resolve => { const image = new Image(); image.onload = () => resolve({ id: card.id, arcana: card.arcana, width: image.naturalWidth, height: image.naturalHeight }); image.onerror = () => resolve({ id: card.id, width: 0, height: 0 }); image.src = card.image; })))');
    assert.ok(loaded.every(image => image.width > 0), 'All 78 card images must render');
    for (const image of loaded.filter(image => image.arcana === 'minor')) {
      assert.equal(image.width, 640, `${image.id} uses optimized delivery artwork`);
      assert.ok(Math.abs(image.width / image.height - 0.625) < 0.025, `${image.id} retains the portrait frame without cropping`);
    }
    // Keyboard activation of a native card button.
    await evaluate('document.getElementById("question").value = "我該如何規劃下一步？"; document.querySelector(".tarot-card").focus()');
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', windowsVirtualKeyCode: 13 });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 1);
    assert.equal(await evaluate('document.getElementById("interpretationTools").hidden'), false);
    assert.equal(await evaluate('document.getElementById("stepRead").getAttribute("aria-current")'), 'step');
    assert.equal(await evaluate('document.querySelector(".prompt-details").open'), true);
    assert.equal(await evaluate('document.querySelectorAll(".reading-thumbnail").length'), 1);
    await evaluate('document.querySelector(".preview-btn").click()');
    assert.equal(await evaluate('document.getElementById("cardPreview").open'), true);
    assert.equal(await evaluate('document.getElementById("previewImage").getAttribute("src")'), await evaluate('document.querySelector(".card-front img").getAttribute("src")'));
    await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await evaluate('Promise.all(document.getAnimations().map(a => a.finished.catch(() => {})))');
    assert.equal(await evaluate('document.getElementById("cardPreview").open'), false);
    assert.equal(await evaluate('document.querySelectorAll(".tarot-card:disabled").length'), 6);
    assert.ok((await evaluate('document.getElementById("AIPrompt").value')).includes('我該如何規劃下一步？'));
    await evaluate('Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async text => { window.copiedText = text; } } }); document.getElementById("copyBtn").click()');
    assert.equal(await evaluate('window.copiedText'), await evaluate('document.getElementById("AIPrompt").value'));
    await evaluate('document.getElementById("resetBtn").click()');
    assert.equal(await evaluate('document.getElementById("question").value'), '我該如何規劃下一步？');
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 0);
    await evaluate('document.querySelector("input[value=three]").click(); document.querySelectorAll(".tarot-card")[5].click()');
    assert.equal(await evaluate('document.getElementById("AIPrompt").value'), '');
    assert.equal(await evaluate('document.getElementById("copyBtn").disabled'), true);
    await evaluate('document.getElementById("language").value = "en"; document.getElementById("language").dispatchEvent(new Event("change"))');
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 1);
    assert.ok((await evaluate('document.querySelector(".reading-card").textContent')).startsWith('Past'));
    await evaluate('document.querySelectorAll(".tarot-card")[1].click(); document.querySelectorAll(".tarot-card")[3].click(); document.querySelectorAll(".tarot-card")[0].click()');
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 3);
    const three = await evaluate('document.getElementById("AIPrompt").value');
    for (const position of ['Past:', 'Present:', 'Future:']) assert.ok(three.includes(position));
    const names = await evaluate('Array.from(document.querySelectorAll(".card-front img"), image => image.src)');
    assert.equal(new Set(names).size, 3);
    // Switching decks clears completed and partial readings, keeps the spread,
    // and cannot leak minor arcana into the major-only pool.
    await evaluate('document.getElementById("deckType").value = "major"; document.getElementById("deckType").dispatchEvent(new Event("change"))');
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 0);
    assert.equal(await evaluate('document.getElementById("AIPrompt").value'), '');
    assert.equal(await evaluate('document.querySelector("input[value=three]").checked'), true);
    assert.ok((await evaluate('document.getElementById("progress").textContent')).includes('22-card'));
    assert.equal(await evaluate('document.getElementById("question").value'), '我該如何規劃下一步？');
    await evaluate('document.querySelectorAll(".tarot-card")[0].click(); document.querySelectorAll(".tarot-card")[2].click(); document.querySelectorAll(".tarot-card")[4].click()');
    assert.equal(await evaluate('Array.from(document.querySelectorAll(".card-front img")).every(image => !image.getAttribute("src").startsWith("cards/"))'), true);
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 3);
    await evaluate('document.getElementById("themeBtn").click(); document.getElementById("changelog").open = true');
    await screenshot('desktop-light-en.png');
    await navigate();
    assert.deepEqual(await evaluate('[document.documentElement.lang, document.documentElement.dataset.theme]'), ['en', 'light']);
    assert.equal(await evaluate('document.getElementById("deckType").value'), 'major');
    await evaluate('document.getElementById("deckType").value = "full"; document.getElementById("deckType").dispatchEvent(new Event("change"))');
    assert.ok((await evaluate('document.getElementById("progress").textContent')).includes('78-card'));
    await evaluate('document.getElementById("question").value = "<img src=x onerror=alert(1)>"; document.querySelector("input[value=three]").click(); document.querySelectorAll(".tarot-card")[0].click(); document.getElementById("resetBtn").click(); document.querySelectorAll(".tarot-card")[1].click(); document.querySelectorAll(".tarot-card")[2].click(); document.querySelectorAll(".tarot-card")[3].click()');
    assert.equal(await evaluate('document.querySelectorAll(".card-front img").length'), 3);
    assert.ok((await evaluate('document.getElementById("AIPrompt").value')).includes('<img src=x onerror=alert(1)>'));
    await evaluate('Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async () => { throw new Error("Denied"); } } }); document.getElementById("copyBtn").click()');
    assert.ok((await evaluate('document.getElementById("notice").textContent')).includes('manually'));
    assert.equal(await evaluate('document.querySelector(".prompt-details").open'), true);
    assert.equal(await evaluate('document.getElementById("AIPrompt").selectionEnd'), (await evaluate('document.getElementById("AIPrompt").value')).length);
    await evaluate('document.getElementById("keepQuestion").checked = false; document.getElementById("keepQuestion").dispatchEvent(new Event("change")); document.getElementById("resetBtn").click()');
    assert.deepEqual(await evaluate('[document.getElementById("question").value, document.getElementById("question").disabled, document.getElementById("AIPrompt").value]'), ['', false, '']);
    // Changing spread must retain a typed question even when explicit reset clears it.
    await evaluate('document.getElementById("question").value = "保留這個問題"; document.querySelector("input[value=single]").click()');
    assert.equal(await evaluate('document.getElementById("question").value'), '保留這個問題');
    await evaluate('document.querySelector("input[value=three]").click()');
    assert.equal(await evaluate('document.getElementById("question").value'), '保留這個問題');
    assert.equal(await evaluate('document.querySelector(".prompt-details").open'), true);
    // Rendering and overflow at a narrow phone width, with completed results.
    await call('Emulation.setDeviceMetricsOverride', { width: 320, height: 900, deviceScaleFactor: 1, mobile: true });
    await evaluate('document.getElementById("question").value = "下一步的指引"; document.querySelectorAll(".tarot-card")[0].click(); document.querySelectorAll(".tarot-card")[2].click(); document.querySelectorAll(".tarot-card")[4].click()');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true);
    await evaluate('Promise.all(document.getAnimations().map(a => a.finished.catch(() => {})))');
    assert.equal(await evaluate('Array.from(document.querySelectorAll("#language, #themeBtn, #deckType, .mode-picker span, .action-btn, .preview-btn, #resetBtn")).every(node => node.getBoundingClientRect().height >= 44)'), true, 'Mobile controls have 44px touch targets');
    await screenshot('mobile-light-en.png');
    await evaluate('document.querySelector(".preview-btn").click()');
    assert.equal(await evaluate('document.getElementById("cardPreview").open'), true);
    assert.equal(await evaluate('document.getElementById("cardPreview").getBoundingClientRect().width <= window.innerWidth'), true);
    await screenshot('mobile-card-preview.png');
    await evaluate('document.getElementById("closePreview").click()');
    await evaluate('Promise.all(document.getAnimations().map(a => a.finished.catch(() => {})))');
    await evaluate('document.getElementById("language").value = "zh"; document.getElementById("language").dispatchEvent(new Event("change")); document.getElementById("themeBtn").click()');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true);
    await screenshot('mobile-dark-zh.png');
    for (const width of [375, 390, 430, 768]) {
      await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: true });
      assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, `No horizontal overflow at ${width}px`);
    }
    await call('Emulation.setDeviceMetricsOverride', { width: 320, height: 900, deviceScaleFactor: 1, mobile: true });
    await evaluate('document.getElementById("deckType").value = "major"; document.getElementById("deckType").dispatchEvent(new Event("change"))');
    assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true);
    assert.equal(await evaluate('document.getElementById("question").value'), '下一步的指引');
    assert.equal(await evaluate('document.querySelectorAll(".flipped").length'), 0);
    // Storage and clipboard may be unavailable (file URLs, private browsing).
    await call('Page.addScriptToEvaluateOnNewDocument', { source: 'Object.defineProperty(window, "localStorage", { get() { throw new Error("Storage disabled"); } }); Object.defineProperty(navigator, "clipboard", { value: undefined });' });
    await navigate();
    assert.deepEqual(await evaluate('[document.documentElement.lang, document.documentElement.dataset.theme]'), ['zh-Hant', 'dark']);
    await evaluate('document.getElementById("question").value = "測試"; document.querySelector(".tarot-card").click(); document.getElementById("copyBtn").click()');
    assert.ok((await evaluate('document.getElementById("notice").textContent')).includes('手動複製'));
    await evaluate('document.getElementById("themeBtn").click()');
    assert.equal(await evaluate('document.documentElement.dataset.theme'), 'light');
    assert.deepEqual(errors, [], 'No browser errors');
    console.log('Browser checks passed: all 78 images, 22/78-card deck selection and persistence, keyboard draw, single/three-card limits, partial readings, localization, themes, reset races, clipboard success/failure, unavailable storage, and 320px mobile layout.');
    console.log('Screenshots saved to artifacts/.');
    await call('Browser.close');
  } finally {
    if (socket) socket.close();
    if (browser && browser.exitCode === null) { browser.kill(); await once(browser, 'exit').catch(() => {}); }
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    // Only remove the dedicated temporary profile created by this script.
    if (path.dirname(profile) === os.tmpdir() && path.basename(profile).startsWith('tarot-browser-check-')) {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
