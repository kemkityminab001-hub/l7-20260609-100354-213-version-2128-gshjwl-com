import { H as Hls } from './video-vendor-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
    var video = document.querySelector('[data-video-player]');
    var overlay = document.querySelector('[data-play-button]');
    var status = document.querySelector('[data-player-status]');

    if (!video || !overlay) {
        return;
    }

    var source = video.getAttribute('data-src');
    var hls = null;
    var started = false;

    function setStatus(message) {
        if (status) {
            status.textContent = message || '';
        }
    }

    function bindSource() {
        if (!source) {
            setStatus('暂未读取到播放地址。');
            return Promise.reject(new Error('Missing source'));
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            return Promise.resolve();
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 60
            });

            hls.loadSource(source);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                setStatus('播放源已加载，可以开始观看。');
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    setStatus('网络加载异常，正在尝试恢复播放。');
                    hls.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    setStatus('媒体解析异常，正在尝试恢复播放。');
                    hls.recoverMediaError();
                } else {
                    setStatus('播放初始化失败，请刷新页面后重试。');
                    hls.destroy();
                }
            });

            return Promise.resolve();
        }

        setStatus('当前浏览器不支持 HLS 播放，请更换现代浏览器。');
        return Promise.reject(new Error('HLS not supported'));
    }

    function startPlayback() {
        if (started) {
            return;
        }

        started = true;
        overlay.classList.add('is-hidden');
        setStatus('正在加载播放源...');

        bindSource().then(function () {
            return video.play();
        }).then(function () {
            setStatus('');
        }).catch(function () {
            overlay.classList.remove('is-hidden');
            started = false;
        });
    }

    overlay.addEventListener('click', startPlayback);

    video.addEventListener('play', function () {
        overlay.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            overlay.classList.remove('is-hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hls) {
            hls.destroy();
        }
    });
});
