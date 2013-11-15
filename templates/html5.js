(function () {
    var e = this;

    function a() {
        return a
    }

    function b(i, g) {
        var h = b.resolve(i),
            f = b.modules[h];
        if (!f) {
            throw new Error('failed to require "' + i + '" from ' + g)
        }
        if (!f.exports) {
            f.exports = {};
            f.call(f.exports, f, f.exports, b.relative(h), e)
        }
        return f.exports
    }
    b.modules = {};
    b.resolve = function (h) {
        var i = h,
            g = h + ".js",
            f = h + "/index.js";
        return b.modules[g] && g || b.modules[f] && f || i
    };
    b.register = function (g, f) {
        b.modules[g] = f
    };
    b.relative = function (f) {
        return function (l) {
            if ("debug" == l) {
                return a
            }
            if ("." != l.charAt(0)) {
                return b(l)
            }
            var k = f.split("/"),
                h = l.split("/");
            k.pop();
            for (var j = 0; j < h.length; j++) {
                var g = h[j];
                if (".." == g) {
                    k.pop()
                } else {
                    if ("." != g) {
                        k.push(g)
                    }
                }
            }
            return b(k.join("/"), f)
        }
    };
    b.register("./events.js", function (h, f, g, i) {
        h.exports = {
            start: {
                event: "started",
                name: "video_started"
            },
            firstQuartile: {
                event: "quartile1",
                name: "video_first_quartile"
            },
            midpoint: {
                event: "midpoint",
                name: "video_midpoint"
            },
            thirdQuartile: {
                event: "quartile3",
                name: "video_third_quartile"
            },
            complete: {
                event: "ended",
                name: "video_ended"
            },
            pause: {
                event: "pause",
                name: "video_paused",
                logic: function () {
                    this.hasPaused = true;
                    return true
                }
            },
            seeking: {
                event: "seeking",
                logic: function (j) {
                    this.beforeSeek = j.target.currentTime;
                    return false
                }
            },
            rewind: {
                event: "seeked",
                name: "video_rewind",
                logic: function (j) {
                    return (j.target.currentTime < (this.beforeSeek || 0))
                }
            },
            fastforward: {
                event: "seeked",
                name: "video_fastforward",
                logic: function (j) {
                    return (j.target.currentTime > (this.beforeSeek || 0))
                }
            },
            resume: {
                event: "play",
                name: "video_resumed",
                logic: function () {
                    if (this.hasPaused) {
                        this.hasPaused = false;
                        return true
                    }
                    return false
                }
            }
        }
    });
    b.register("./html.js", function (i, g, h, j) {
        var f = h("./images.js");
        i.exports = function (n) {
            function w() {
                var y = ["name", "uuid", "video"];
                var B = ["height", "width", "source"];
                var A = true;
                var z, x;
                for (z = 0, x = y.length; z < x; z++) {
                    if (!n[y[z]]) {
                        A = false
                    }
                }
                for (z = 0, x = B.length; z < x; z++) {
                    if (!n.video[B[z]]) {
                        A = false
                    }
                }
                return A
            }

            function s(y, z) {
                for (var x in z) {
                    if (z.hasOwnProperty(x)) {
                        y.style[x] = z[x]
                    }
                }
            }

            function t() {
                if (!this.iframe) {
                    var x = document.createElement("iframe");
                    x.id = n.name + "-" + n.uuid;
                    x.src = "about:blank";
                    x.marginwidth = 0;
                    x.marginheight = 0;
                    x.frameborder = 0;
                    x.scrolling = "no";
                    x.seamless = "seamless";
                    s(x, {
                        background: "transparent",
                        bottom: 0,
                        height: "100%",
                        left: 0,
                        opacity: 1,
                        position: "fixed",
                        right: 0,
                        top: 0,
                        visibility: "visible",
                        width: "100%",
                        zIndex: 2147483647
                    });
                    this.iframe = x
                }
                return this.iframe
            }

            function m() {
                var x = document.createElement("div");
                x.id = "overlay-" + n.uuid;
                s(x, {
                    background: "black",
                    height: "100%",
                    left: 0,
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    visibility: "visible",
                    width: "100%"
                });
                return x
            }

            function k() {
                var z = document.createElement("img");
                z.src = f.logo;
                var y = document.createElement("img");
                y.src = f.close;
                y.alt = "Close (X)";
                y.className = "close";
                s(y, {
                    cursor: "pointer",
                    position: "absolute",
                    right: 0,
                    top: 0
                });
                var x = document.createElement("div");
                x.id = "container-" + n.uuid;
                x.appendChild(z);
                x.appendChild(y);
                s(x, {
                    background: "black",
                    border: "black solid 5px",
                    display: "none",
                    height: 0,
                    opacity: 1,
                    margin: "0 auto",
                    overflow: "hidden",
                    position: "relative",
                    width: 0,
                    zIndex: 10
                });
                return x
            }

            function p(x) {
                if (x.toString() !== "[object HTMLDivElement]") {
                    throw new Error("Sparkle: wrapContainer expects a DIV.")
                }
                var z = document.createElement("div");
                z.id = "wrapper-" + n.uuid;
                z.appendChild(x);
                s(z, {
                    display: "table-cell",
                    verticalAlign: "middle"
                });
                var y = document.createElement("div");
                y.id = "centering-" + n.uuid;
                y.appendChild(z);
                s(y, {
                    display: "table",
                    height: "100%",
                    margin: "0 auto",
                    overflow: "hidden",
                    width: n.video.width + "px"
                });
                return y
            }

            function r() {
                var x = document.createElement("a");
                x.href = n.click_url;
                x.target = "_blank";
                s(x, {
                    display: "block",
                    height: "100%",
                    left: 0,
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    zIndex: 100
                });
                return x
            }

            function v() {
                var x = document.createElement("div");
                x.id = "play-" + n.uuid;
                s(x, {
                    background: "transparent url(" + f.playOverlay + ") center center no-repeat",
                    display: "block",
                    height: "100%",
                    left: 0,
                    position: "absolute",
                    top: 0,
                    width: "100%",
                    zIndex: 200
                });
                return x
            }

            function o() {
                var y = document.createElement("video");
                y.id = "video-" + n.uuid;
                y.preload = "auto";
                y.width = n.video.width;
                y.height = n.video.height;
                if (n.video.placeholder_image_url) {
                    y.poster = n.video.placeholder_image_url
                }
                s(y, {
                    height: n.video.height + "px",
                    margin: "0",
                    opacity: 1,
                    visibility: "visible",
                    width: n.video.width + "px"
                });
                var z = document.createElement("source");
                z.src = n.video.source;
                z.type = "video/mp4";
                y.appendChild(z);
                var x = document.createElement("div");
                s(x, {
                    height: n.video.height + "px",
                    margin: "3px 0",
                    position: "relative",
                    width: n.video.width + "px"
                });
                x.appendChild(y);
                if (n.click_url && n.click_url.length) {
                    x.appendChild(r())
                }
                x.appendChild(v());
                return x
            }

            function l() {
                var x = document.createElement("div");
                x.id = "timer-" + n.uuid;
                s(x, {
                    bottom: 0,
                    color: "white",
                    fontFamily: "Helvetica,Arial,sans-serif",
                    fontSize: "14px",
                    position: "absolute",
                    right: 0
                });
                return x
            }

            function q() {
                var y = document.createElement("div");
                s(y, {
                    height: "35px",
                    margin: "5px auto 0",
                    padding: "0 50px 0 50px",
                    position: "relative",
                    width: "40%"
                });
                var D = document.createElement("div");
                s(D, {
                    background: "url(" + f.playPause + ") 0 0 no-repeat",
                    height: "100%",
                    left: 0,
                    position: "absolute",
                    top: 0,
                    width: "35px"
                });
                var B = document.createElement("div");
                s(B, {
                    height: "100%",
                    overflow: "visible",
                    position: "relative",
                    width: "100%"
                });
                var A = document.createElement("div");
                s(A, {
                    background: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "5px",
                    height: "10px",
                    left: 0,
                    position: "absolute",
                    top: "12px",
                    width: "100%"
                });
                var x = document.createElement("div");
                s(x, {
                    background: "#0066cc", //progress bar color
                    borderRadius: "5px",
                    height: "100%",
                    width: 0
                });
                var z = document.createElement("div");
                s(z, {
                    height: "100%",
                    left: 0,
                    overflow: "visible",
                    position: "absolute",
                    top: 0,
                    width: "35px",
                    zIndex: 10
                });
                var C = document.createElement("div");
                s(C, {
                    background: "url(" + f.slider + ") center center no-repeat",
                    height: "35px",
                    left: "-17px",
                    position: "relative",
                    width: "35px"
                });
                A.appendChild(x);
                z.appendChild(C);
                B.appendChild(A);
                B.appendChild(z);
                y.appendChild(D);
                y.appendChild(B);
                return y
            }

            function u() {
                if (!this.verifyRequiredHtmlParams()) {
                    throw Error("HTML parameters are invalid")
                }
                var D = document.createDocumentFragment();
                var z = this.createOverlay();
                var x = this.createVideoContainer();
                var B = this.createVideoElement();
                var y = this.createVideoControls();
                var C = this.createVideoTimer();
                x.appendChild(B);
                x.appendChild(y);
                x.appendChild(C);
                var A = this.wrapContainer(x);
                D.appendChild(z);
                D.appendChild(A);
                return D
            }
            return {
                verifyRequiredHtmlParams: w,
                createIframe: t,
                createOverlay: m,
                createVideoContainer: k,
                createVideoElement: o,
                createVideoTimer: l,
                createVideoControls: q,
                wrapContainer: p,
                build: u
            }
        }
    });
    b.register("./images.js", function (h, f, g, i) {
        h.exports = {
            logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN8AAAAPCAMAAABTGeoxAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRF7u7uREREqqqqERERiIiIVVVVd3d3u7u7IiIi3d3dzMzMMzMzZmZmmZmZ////AAAAuS0W/QAAAlxJREFUeNrslt2CqyAMhFEUCL/v/7ZnEkBjV9u9PbvrhUqZDHwGSE372Zf58Xyhjmshz7/g7tFyzRk8tqFzhEYJLXHfGiCDAveSZ/h4WXI1trVcT1+O7y/aconiJGE+tdO5VJ5HoXbIVReLLY8ubzKGmXPsI65trYFnLAP3/HkaZOPuoHAM4KiHbrXwjJZkIhijCRiBMajI5PmeOwieHJhlDE/Hh+RXbZmYAo4clsjY07nIJwHflOsuxBg/pwoiVhiyqlVdMCs3SnvL59XSXboYQoaSWFqNe+ArEN3yaUtX05Av3NhP50LeC9+Uqy7wIT1XvonSWwEJh11bJegN3zom0NPX3y2yz1c0IONE3PIlk+/5tKUkR/GdzoUWBINvyNWgnc+88EFoVf4QRLTX3L7w9f0y+JKpsXSRfDLlh3EsFQuMC59cTAbyWz5taWM1xXW+RFE5c+Y4i1OuuyoHuDlVN7rGWpj7j9db9a29zx/uhYbslo+3xm3+gqV8y6ctISyxUj9fVnvlSzXw+dLlFz4+yNpr/g4+N7YntOkzn+iWx/UJ6X7P13J84Dsth9aNML0IoSxboSnfL+tzl8Ge12fPxQHwgS9jpz6cL/gl+wc+9D7yDcsxv22G6fMFT7PSIb+eL7Jxn88X2Z7f4YsoKyEeX5Hrg+f6kLBdKPSVSfWBD6vuhk9bFhRTFNoww05nyVypdMhVVz8/95f6EC/1YfvIJ/XdRamgj/W9M305X5a+MumFT7q0ZWajuByfRRVxkrmi/k25qu+8lMmkN/V97MjwW/6f/fH9z9c/AQYARA6rTbiOX98AAAAASUVORK5CYII=",
            close: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANtJREFUeNpiOX78+HsGBgZuIP7LQBrgAOI/LFDNIMxMogE/gPg/C9RmZqgAyYAJjV8NxC041HIC8XYgtsFlAMgVKjgMAWneBcSuQCyBLMGCxAZ5JRHJJSADK5E0WwJxBBCvwWUADMAMqYAaYolLMy4DkA0phboMq2ZsgYjsZxWksDHGFQssODTD/BwKxB5Q7zBAwwSvATzQqEL28xqkMMEwBN2ALTgCLAUaFiBDPgJxBy4DpkAxtgBLB+J32KLxPxAzQvlrCKTcSmyxAAq07wxkApgX/pNrAECAAQCS+SsWBzL+CwAAAABJRU5ErkJggg==",
            playPause: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAABGCAYAAABG4C2wAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXFJREFUeNrs2DEohGEcx/F7j5RSJpO6MsggIhNlsdJNjAYLJVKkmIyKRZlsYmRRlIVJLKSIiFJWpUwmvb5vPYPp3L33Pp7/6ffWpxuuu773PO/7PO97+TiOc1bkc4aOmoqZsRSziUv0WJmmPhe0gSYL50wd5vCAUSsncCv2cIg2K1fTMO6whAYLl3YjVnGDISvrTAdOsIMWK4veOJ4waWUFbsYWztFlZTvoxzXWKlmbfO5Nydq06K66opWNsoADp2Bl1y66FXzeyi3EFY5Dx7xjAoO4DxmzjXb3WvKo9xiRjMAUzkJe2p9YRm8lIT5G5gizeAm5HbxiDCNpQ7KI+cI6OrFf7S+qZpou3Al6G/Lm6sNFDGQZkmZkdrGANx9rQbkxj5jGachHlWTNWEG375ByRiaJeLbyePtnITX3L4RiFKMYxfyrmN/2prjEe1GGn9E0KUYxilGMYhSjGMUoxso9cJTiOyNNk2IUo5gfx7cAAwCoT52uPUZg1wAAAABJRU5ErkJggg==",
            slider: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAbFJREFUeNrkWLGKg0AQXcMREBQCFh7WdgcWKVLmH1LcJwT8GD8gkB84uCL/kFJIisB11oKFEEgw5d5M2Byert5OMJuFe/Ag7jrzHruZZVaLc85MwIgZghfi+wFwDpwBI2AI9MVcAcyAB2AK3AJz1cSW4ta8Ad+BC2FABWhoA/wEfv35NhrpIRqNgTt+P3Yih9Wn1WfiFZjw4ZCInCQjGLDiw2PVZaZrOxL+OCSybZIZifnjETd1R5LqWGo4NpZCq/NAwxKdajAyFVpSI4E4J3RhITRbRuaEw2oIREKzdcTPKFnO5zM7Ho/sdDpdn13XZZPJhDmOQ0mDmh9NIxHFRJ7n7HK5/IyVZcmqqmJBEFDMRLKtCVWjcSXqJm7AMZwjIJQZ8VWjb9tBnZPAN64fqRspVIPwj3nPnASFzEimGo3VYdt2axzHcI6ATGbkoBqNVYHV4XkeG4/HV+JvYsX80qyXb0rJgIJEURlS2YpsKasyAA5Cs2UkFz2mLmzqzXWzfLHR3WswsRdanW0AdttrDUbWrc7e5FbRmObZqOuE9guWMVdOi/hZ4umX8P/zfeRbgAEAPQ2yRYLStFQAAAAASUVORK5CYII=",
            playOverlay: "data:image/png;base64,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"
        }
    });
    b.register("./loader.js", function (h, F, q, y) {
        var r = q("./html.js");
        var l = q("./tracker.js");
        var D = q("./events.js");
        var E = 1000;
        var j = 30;
        var z = 30;
        var x = ".rackcdn.com";

        function w(G) {
            if (typeof G !== "string" || !G.length) {
                G = "Undefined Error"
            }
            if (typeof console !== "undefined" && typeof console.log === "function") {
                console.log(G)
            }
            throw new Error(G)
        }

        function v() {
            var L = this.p;
            var H = Date.now();
            var I = H + "-" + (Math.random() * 100000000000 + 1);
            var G = new Date();
            G.setTime(H + z * 24 * 60 * 60 * 1000);
            var K = "";
            if (L && L.cookieDomain) {
                K = "; HttpOnly; domain=" + L.cookieDomain
            }
            var J = "AdTouchD30=" + I + "; expires=" + G.toUTCString() + K + "; path=/";
            try {
                if (!L.cookieDomain) {
                    L.cookieVal = J
                }
            } catch (M) {}
            document.cookie = J;
            return I
        }

        function B() {
            var J;
            var K = document.cookie.split(";");
            for (var I = 0, G = K.length; I < G; I++) {
                var H = K[I].substr(0, K[I].indexOf("="));
                var L = K[I].substr(K[I].indexOf("=") + 1);
                H = H.replace(/^\s+|\s+$/g, "");
                if (H == "AdTouchD30") {
                    J = decodeURIComponent(L)
                }
            }
            if (!J) {
                J = this.setCookie()
            }
            return J
        }

        function n(I, H) {
            var G = this;
            G.overlay = I.body.childNodes[0];
            G.container = I.getElementById("container-" + H);
            G.logo = G.container.childNodes[0];
            G.xBtn = G.container.childNodes[1];
            G.video = I.getElementById("video-" + H);
            G.playOverlay = I.getElementById("play-" + H);
            G.controls = G.container.childNodes[3];
            G.ctlPlay = G.controls.childNodes[0];
            G.ctlSlider = G.controls.childNodes[1];
            G.ctlVol = G.controls.childNodes[2];
            G.ctlMute = G.controls.childNodes[3];
            G.timer = I.getElementById("timer-" + H)
        }

        function t(I, G) {
            var H = this;
            if (!I) {
                H.throwLog("You must provide the parameters object to the open method.")
            }
            if (H.frag.toString() !== "[object DocumentFragment]") {
                H.throwLog("You must create the document fragment before calling open().")
            }
            setTimeout(function () {
                var L = H.HTML.createIframe();
                var M = top.document;
                var K = M.body;
                K.style.overflow = "hidden";
                K.appendChild(L);
                H.iframe = M.getElementById(L.id);
                var N = H.iframe.contentDocument;
                var J = N.body;
                J.appendChild(H.frag);
                n.call(H, N, I.uuid);
                H.bindEventHandlers();
                H.showOverlay(I, function () {
                    H.showVideo(I, function () {
                        H.trackEvent("open");

                        function O() {
                            try {
                                //#onin: disabled autoplay to favor ipad autoclose
                                //H.video.play();
                                //H.videoEvent(D.start.event)
                            } catch (P) {}
                        }
                        H.video.addEventListener("canplay", O, false);
                        O();
                        //I.close.call(I);
                        if (typeof G === "function") {
                            G()
                        }
                    })
                })
            }, I.delay)
        }

        function A(L, G) {
            var I = this;
            var J = I.overlay;
            var K = L.opacity / (L.speed / j);
            var H = setInterval(function () {
                var M = parseFloat(J.style.opacity) || 0;
                J.style.opacity = M + K;
                if (J.style.opacity >= L.opacity) {
                    clearInterval(H);
                    J.style.opacity = L.opacity;
                    if (typeof G === "function") {
                        G()
                    }
                }
            }, j)
        }

        function k(M, G) {
            var J = this;
            if (!M) {
                J.throwLog("You must provide params to showVideo.")
            }
            if (!J.container) {
                J.throwLog("No container when trying to showVideo.")
            }
            var I = M.video.width;
            var H = J.container;
            H.style.display = "block";
            var L = I / (M.speed / j);
            if (L > I) {
                L = I
            }
            var K = setInterval(function () {
                if (!H || !H.style) {
                    H = J.container
                }
                H.style.width = parseFloat(H.style.width) + L + "px";
                if (parseInt(H.style.width) >= I) {
                    clearInterval(K);
                    H.style.width = I + "px";
                    var N = parseInt(J.logo.height) + M.video.height + parseInt(J.controls.style.height) + 5;
                    var O = N / (M.speed / (j * 2));
                    var P = setInterval(function () {
                        H.style.height = parseFloat(H.style.height) + O + "px";
                        if (parseInt(H.style.height) >= M.video.height) {
                            clearInterval(P);
                            H.style.height = "auto";
                            if (typeof G === "function") {
                                G()
                            }
                        }
                    }, j)
                }
            }, j)
        }

        function u(G) {
            var H = this;
            if (H.video.paused === false) {
                H.video.pause()
            }
            H.hideVideo.call(H, function () {
                H.hideOverlay.call(H, function () {
                    H.trackEvent("close");
                    top.document.body.style.overflow = "auto";
                    try {
                        top.document.body.removeChild(H.iframe)
                    } catch (I) {
                        if (H.iframe && H.iframe.parentNode) {
                            H.iframe.parentNode.removeChild(H.iframe)
                        }
                    }
                    if (typeof G === "function") {
                        G()
                    }
                })
            })
        }

        function C(G) {
            var I = this;
            var M = I.p;
            var J = I.overlay;
            var L = M.speed;
            if (L < j * 2) {
                L = j * 2
            }
            var K = J.style.opacity / (L / (j * 2));
            var H = setInterval(function () {
                var N = parseFloat(J.style.opacity) || 0;
                var O = N - K;
                J.style.opacity = O > 0 ? O : 0;
                if (J.style.opacity == 0) {
                    clearInterval(H);
                    J.style.display = "none";
                    G()
                }
            }, j)
        }

        function p(G) {
            var I = this;
            var N = I.p;
            if (!I.container) {
                I.container = I.iframe.contentDocument.getElementById("container-" + N.uuid)
            }
            var H = I.container;
            var M = parseInt(I.logo.height) + N.video.height + parseInt(I.controls.style.height) + 10;
            H.style.height = M + "px";
            var L = N.speed;
            if (L < j * 2) {
                L = j * 2
            }
            var J = M / (L / (j * 2));
            var K = setInterval(function () {
                H.style.height = parseFloat(H.style.height) - J + "px";
                if (parseFloat(H.style.height) < J) {
                    clearInterval(K);
                    H.style.height = 0;
                    var P = N.video.width / (L / j);
                    if (P > N.video.width) {
                        P = N.video.width
                    }
                    var O = setInterval(function () {
                        H.style.width = parseFloat(H.style.width) - P + "px";
                        if (parseFloat(H.style.width) < P) {
                            clearInterval(O);
                            H.style.display = "none";
                            G()
                        }
                    }, j)
                }
            }, j)
        }

        function s() {
            var I = this;
            l.bindVideoEvents(I.video, I.p);

            function G() {
                I.close.call(I)
            }

            //onin: auto close timer
            var autoCloseTimer = setTimeout(function() {
                G();
            }, I.p.auto_close_timer * 1000);

            I.xBtn.addEventListener("click", G, false);
            I.overlay.addEventListener("click", G, false);
            I.video.addEventListener("ended", G, false);
            I.playOverlay.addEventListener("click", function () {
                clearInterval(autoCloseTimer);
                I.video.play()
            }, false);
            I.video.addEventListener("play", function () {
                I.playOverlay.style.display = "none"
            });
            var K = 0;
            var L = 0;
            var H = I.ctlSlider.childNodes[0].childNodes[0];
            var M = I.ctlSlider.childNodes[1];
            this.video.addEventListener("timeupdate", function () {
                var O = Math.floor(I.video.duration - I.video.currentTime);
                if (O !== K) {
                    K = O;
                    var P = (K % 60) + "";
                    if (P.length < 2) {
                        P = "0" + P
                    }
                    I.timer.innerHTML = Math.floor(K / 60) + ":" + P
                }
                var N = ((I.video.currentTime / I.video.duration) * 100) + "%";
                if (Date.now() - L > 100) {
                    L = Date.now();
                    H.style.width = N;
                    M.style.left = N
                }
            }, false);
            var J = this.ctlPlay;
            I.video.addEventListener("play", function () {
                J.style.backgroundPosition = "0 -35px"
            }, false);
            I.video.addEventListener("pause", function () {
                J.style.backgroundPosition = "0 0"
            }, false);
            J.addEventListener("click", function () {
                if (I.video.paused) {
                    I.video.play();
                    J.style.backgroundPosition = "0 -35px"
                } else {
                    I.video.pause();
                    J.style.backgroundPosition = "0 0"
                }
            }, false);
            if (I.p.click_url && I.p.click_url.length) {
                I.video.parentNode.childNodes[1].addEventListener("click", function () {
                    I.video.pause();
                    J.style.backgroundPosition = "0 0"
                })
            }
        }

        function m(H) {
            var G = document.createEvent("Event");
            G.initEvent(H, true, false);
            this.video.dispatchEvent(G)
        }

        function i(I) {
            var L = ["name", "advertiser_id", "creative_id", "base_url", "atac_url", "video"];
            var M = ["source", "height", "width"];
            for (var K = 0, H = L.length; K < H; K++) {
                var G = L[K];
                if (typeof I[G] === "undefined") {
                    throw new Error("You must provide a " + G + " parameter.")
                }
                if (G === "video") {
                    for (var N = 0, J = M.length; N < J; N++) {
                        var O = M[N];
                        if (typeof I.video[O] === "undefined") {
                            throw new Error("You must provide a video." + G + " parameter.")
                        }
                    }
                }
            }
        }

        function f(I) {
            if (!I) {
                this.throwLog("You must provide parameters to setDefaultsForUndefinedParameters.")
            }
            var G = {
                delay: 0,
                speed: 500,
                opacity: 0.75
            };
            for (var H in G) {
                if (G.hasOwnProperty(H)) {
                    if (typeof I[H] === "undefined") {
                        I[H] = G[H]
                    }
                }
            }
        }

        function g(G) {
            var H = this;

            function I() {
                top.document.removeEventListener("DOMContentLoaded", I, false);
                top.removeEventListener("load", I, false);
                clearInterval(H.loadTimer.timer);
                G()
            }
            top.document.addEventListener("DOMContentLoaded", I, false);
            top.addEventListener("load", I, false);
            H.loadTimer.timer = setInterval(function () {
                if ((/loaded|complete/).test(document.readyState)) {
                    I()
                }
            }, H.loadTimer.delay)
        }
        var o = function (K, I) {
            if (!K || typeof K !== "object") {
                throw new Error("You must provide an parameters Object")
            }
            this.p = K;
            i(K);
            K.cookieDomain = x;
            K.uuid = this.getCookie();
            f(K);
            this.initTracking(K);
            this.trackEvent("init");
            this.HTML = r(K);
            this.frag = this.HTML.build();
            var H = document.createElement("video");
            H.volume = 0.5;
            H.muted = true;
            H.src = K.video.source;
            this.loadTimer = this.loadTimer || {
                delay: E
            };
            var J = false;
            var G = this;
            g.call(this, function () {
                if (!J) {
                    J = true;
                    G.open(K, I)
                }
            })
        };
        o.prototype = {
            throwLog: w,
            setCookie: v,
            getCookie: B,
            open: t,
            showOverlay: A,
            showVideo: k,
            close: u,
            hideOverlay: C,
            hideVideo: p,
            bindEventHandlers: s,
            videoEvent: m,
            initTracking: l.init,
            trackEvent: l.trackEvent
        };
        h.exports = o
    });
    b.register("./tracker.js", function (j, h, i, k) {
        var g = i("./events.js");
        var f;
        j.exports = {
            init: function (n) {
                f = this;
                f.cam = n.advertiser_id;
                f.cat = n.name;
                f.adIsOpen = false;
                top._atq = top._atq || [];
                var l = document.createElement("script");
                l.type = "text/javascript";
                l.async = true;
                l.src = n.atac_url;
                document.getElementsByTagName("head")[0].appendChild(l);

                function m() {
                    if (f.adIsOpen) {
                        f.trackEvent("leftPage")
                    }
                }
                window.addEventListener("unload", m, false);
                window.addEventListener("beforeunload", function () {
                    window.removeEventListener("unload", m, false);
                    m()
                }, false)
            },
            trackEvent: function (o, l, n, m) {
                if (["open", "close"].indexOf(o) > -1) {
                    f.adIsOpen = (o == "open")
                }
                o = o.replace(/\s/g, "_");
                if (!l && !n && f.video) {
                    l = "video_time";
                    n = f.video.currentTime
                }
                top._atq.push(["_setCampaign", f.cam]);
                top._atq.push(["_trackEvent", f.cat, o, l || null, n || null, m || false])
            },
            trackThirdParty: function (l, m) {
                (function (p, o) {
                    var n = new Image();
                    if (n.onerror) {
                        f.trackEvent("failed_3rd_party_tracking", o, p)
                    }
                    n.src = p
                }(l, m))
            },
            bindVideoEvents: function (n, p) {
                var m = (p.events && p.events.video);
                f.video = n;
                f.hasPaused = false;
                f.isMuted = false;
                top.document.addEventListener("webkitfullscreenchange", function () {
                    if (document.webkitIsFullscreen) {
                        f.trackEvent("fullscreen");
                        if (m && p.events.video.fullscreen) {
                            f.trackThirdParty(p.events.video.fullscreen, "fullscreen")
                        }
                    }
                }, false);
                var o = 0;
                n.addEventListener("timeupdate", function () {
                    var q = ((f.video.currentTime / f.video.duration) * 100);
                    if (Math.floor(q) >= 25 && o < 25) {
                        o = 25;
                        f.videoEvent(g.firstQuartile.event)
                    } else {
                        if (Math.floor(q) >= 50 && o < 50) {
                            o = 50;
                            f.videoEvent(g.midpoint.event)
                        } else {
                            if (Math.floor(q) >= 75 && o < 75) {
                                o = 75;
                                f.videoEvent(g.thirdQuartile.event)
                            }
                        }
                    }
                });
                for (var l in g) {
                    if (!g.hasOwnProperty(l)) {
                        continue
                    }(function (q, r) {
                        n.addEventListener(r.event, function (s) {
                            if (typeof r.logic !== "function" || r.logic.call(f, s)) {
                                f.trackEvent(r.name);
                                if (m && p.events.video[q]) {
                                    //f.trackThirdParty(p.events.video[q], q)
                                    var img1x1 = document.createElement('img');
                                    //console.log(q);
                                    img1x1.src = p.events.video[q] + "&tr=" + Math.random();
                                    document.getElementsByTagName('body')[0].appendChild(img1x1);
                                    this.parentNode.appendChild(img1x1);
                                    //console.log(this.parentNode);
                                }
                            }
                        }, false)
                    }(l, g[l]))
                }
            }
        }
    });

    /*********************************************/
    /* begin +video ipad html template variables */
    /*********************************************/
    var ad_advertiser_id        = 91527, // ie. 91527 (for +video)

        ad_container            = 'a-brides-zales-20131023',

        /*** use only 1 ad_base_url, switch between servers ***/
        /* local dev server */
        //ad_base_url             = 'http://localhost/sandbox/test-d30/' + ad_container,
        /* staging server */
        //ad_base_url             = 'http://adgentsocial.com/t30/branches/jesus/test-d30/' + ad_container,
        /* production server (cdn) */
        ad_base_url             = 'http://cdn.video.adtouch.com/' + ad_container,

        ad_creative_id          = 9569456, // ie. 9569456
        ad_video_filename       = '/video.mp4', // ie. '/video.mp4'

        ad_vid_first_quartile   = 'http://ib.adnxs.com/imptr?id=4752&t=2', // ie. 'http://ib.adnxs.com/imptr?id=4658&t=2'
        ad_vid_mid_point        = 'http://ib.adnxs.com/imptr?id=4753&t=2', // ie. 'http://ib.adnxs.com/imptr?id=4659&t=2'
        ad_vid_third_quartile   = 'http://ib.adnxs.com/imptr?id=4754&t=2', // ie. 'http://ib.adnxs.com/imptr?id=4660&t=2'
        ad_vid_complete         = 'http://ib.adnxs.com/imptr?id=4755&t=2', // ie. 'http://ib.adnxs.com/imptr?id=4661&t=2'

        ad_click_url            = 'http://ib.adnxs.com/clktrb?id=222416',  // ie. 'http://ib.adnxs.com/clktrb?id=201538'

        ad_timer_auto_close     = 15; // in seconds
    /*******************************************/
    /* end +video ipad html template variables */
    /*******************************************/

    var d = b("./loader.js"),
        c = new d({
            name: ad_container,
            auto_close_timer: ad_timer_auto_close,
            advertiser_id: ad_advertiser_id,
            creative_id: ad_creative_id,
            base_url: ad_base_url,
            click_url: ad_click_url + "&tr=" + Math.random() || "",
            atac_url: "http://2069a3a7ee0f80c7bb65-9d3947651ddde89ca8b9af8156e6cb1b.r7.cf1.rackcdn.com/atac.1.2.js",
            delay: 0,
            speed: 500,
            opacity: .75,
            video: {
                source: ad_base_url + ad_video_filename,
                height: 480,
                width: 640,
                placeholder_image_url: ""
            },
            events: {
                init: "",
                loaded: "",
                open: "",
                close: "",
                leftPage: "",
                video: {
                    start: "",
                    firstQuartile: ad_vid_first_quartile,
                    midpoint: ad_vid_mid_point,
                    thirdQuartile: ad_vid_third_quartile,
                    complete: ad_vid_complete,
                    mute: "",
                    unmute: "",
                    pause: "",
                    rewind: "",
                    fastforward: "",
                    resume: "",
                    fullscreen: ""
                }
            },
            version: "0.7.1"
        })

    //console.log(c);
}());
