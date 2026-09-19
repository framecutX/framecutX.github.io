document.documentElement.classList.add("js");

(function () {
  "use strict";

  var RELEASE_API = "https://api.github.com/repos/framecutX/FrameCut/releases/latest";
  var RELEASES_URL = "https://github.com/framecutX/FrameCut/releases";
  var FALLBACK_TAG = "v1.0.2+6";
  var FALLBACK_HASH = "b3f84feaa8b824ebbf2e0c653bde3288f3ddbda3be0aee1a54f234e41ffb7ccb";

  function each(selector, callback) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), callback);
  }

  function plainVersion(tag) {
    return String(tag || "").replace(/^v/i, "") || "未知版本";
  }

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "未知";
    return (bytes / 1024 / 1024).toFixed(2) + " MiB";
  }

  function formatDate(value) {
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return "未知";
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date).replace(/\//g, "-");
  }

  function setReleaseStatus(message, ready) {
    var status = document.querySelector(".release-status");
    if (!status) return;
    status.lastChild.textContent = " " + message;
    status.classList.toggle("ready", Boolean(ready));
  }

  function updateRelease(release) {
    var assets = Array.isArray(release.assets) ? release.assets : [];
    var installer = assets.find(function (asset) {
      return /framecut-.*-setup\.exe$/i.test(asset.name || "");
    });
    var version = plainVersion(release.tag_name);
    var tagMatchesFallback = release.tag_name === FALLBACK_TAG;
    var digest = installer && typeof installer.digest === "string" && installer.digest.indexOf("sha256:") === 0
      ? installer.digest.slice(7)
      : (tagMatchesFallback ? FALLBACK_HASH : "请在该版本的发布说明中核对 SHA256");

    each(".release-version", function (node) {
      node.textContent = node.closest(".hero-meta") ? "版本 " + version : version;
    });

    if (installer) {
      each(".release-download", function (link) {
        link.href = installer.browser_download_url;
      });
      var filename = document.querySelector(".release-filename");
      var size = document.querySelector(".release-size");
      if (filename) filename.textContent = installer.name;
      if (size) size.textContent = formatBytes(installer.size);
      setReleaseStatus("已获取最新正式版", true);
    } else {
      each(".release-download", function (link) {
        link.href = release.html_url || RELEASES_URL;
      });
      setReleaseStatus("此版本请从发布页查看", false);
    }

    var date = document.querySelector(".release-date");
    var checksum = document.querySelector(".release-checksum");
    if (date) date.textContent = formatDate(release.published_at || release.created_at);
    if (checksum) checksum.textContent = digest;
  }

  function loadLatestRelease() {
    fetch(RELEASE_API, {
      headers: { "Accept": "application/vnd.github+json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("GitHub API returned " + response.status);
        return response.json();
      })
      .then(updateRelease)
      .catch(function () {
        each(".release-download", function (link) { link.href = RELEASES_URL; });
        setReleaseStatus("暂未读取到线上版本，请前往发布页", false);
      });
  }

  function setupNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "打开导航菜单" : "关闭导航菜单");
      nav.classList.toggle("open", !open);
    });

    each(".site-nav a", function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "打开导航菜单");
        nav.classList.remove("open");
      });
    });
  }

  function setupHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function update() { header.classList.toggle("scrolled", window.scrollY > 12); }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function setupReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      each(".reveal", function (node) { node.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px" });
    Array.prototype.forEach.call(nodes, function (node) { observer.observe(node); });
  }

  function setupChecksumCopy() {
    var button = document.querySelector(".copy-checksum");
    var checksum = document.querySelector(".release-checksum");
    if (!button || !checksum) return;
    button.addEventListener("click", function () {
      var value = checksum.textContent.trim();
      if (!/^[a-f0-9]{64}$/i.test(value) || !navigator.clipboard) return;
      navigator.clipboard.writeText(value).then(function () {
        button.textContent = "已复制";
        window.setTimeout(function () { button.textContent = "复制"; }, 1600);
      });
    });
  }

  var year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
  setupNavigation();
  setupHeader();
  setupReveal();
  setupChecksumCopy();
  loadLatestRelease();
}());
