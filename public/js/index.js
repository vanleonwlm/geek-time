/*! instant.page v1.2.2 - (C) 2019 Alexandre Dieulot - https://instant.page/license */

let urlToPreload
let mouseoverTimer
let lastTouchTimestamp

const prefetcher = document.createElement('link')
const isSupported = prefetcher.relList && prefetcher.relList.supports && prefetcher.relList.supports('prefetch')
const isDataSaverEnabled = navigator.connection && navigator.connection.saveData
const allowQueryString = 'instantAllowQueryString' in document.body.dataset
const allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset

if (isSupported && !isDataSaverEnabled) {
    prefetcher.rel = 'prefetch'
    document.head.appendChild(prefetcher)

    const eventListenersOptions = {
        capture: true,
        passive: true,
    }
    document.addEventListener('touchstart', touchstartListener, eventListenersOptions)
    document.addEventListener('mouseover', mouseoverListener, eventListenersOptions)
}

function touchstartListener(event) {
    /* Chrome on Android calls mouseover before touchcancel so `lastTouchTimestamp`
     * must be assigned on touchstart to be measured on mouseover. */
    lastTouchTimestamp = performance.now()

    const linkElement = event.target.closest('a')

    if (!isPreloadable(linkElement)) {
        return
    }

    linkElement.addEventListener('touchcancel', touchendAndTouchcancelListener, {passive: true})
    linkElement.addEventListener('touchend', touchendAndTouchcancelListener, {passive: true})

    urlToPreload = linkElement.href
    preload(linkElement.href)
}

function touchendAndTouchcancelListener() {
    urlToPreload = undefined
    stopPreloading()
}

function mouseoverListener(event) {
    if (performance.now() - lastTouchTimestamp < 1100) {
        return
    }

    const linkElement = event.target.closest('a')

    if (!isPreloadable(linkElement)) {
        return
    }

    linkElement.addEventListener('mouseout', mouseoutListener, {passive: true})

    urlToPreload = linkElement.href

    mouseoverTimer = setTimeout(() => {
        preload(linkElement.href)
        mouseoverTimer = undefined
    }, 65)
}

function mouseoutListener(event) {
    if (event.relatedTarget && event.target.closest('a') == event.relatedTarget.closest('a')) {
        return
    }

    if (mouseoverTimer) {
        clearTimeout(mouseoverTimer)
        mouseoverTimer = undefined
    } else {
        urlToPreload = undefined
        stopPreloading()
    }
}

function isPreloadable(linkElement) {
    if (!linkElement || !linkElement.href) {
        return
    }

    if (urlToPreload == linkElement.href) {
        return
    }

    const preloadLocation = new URL(linkElement.href)

    if (!allowExternalLinks && preloadLocation.origin != location.origin && !('instant' in linkElement.dataset)) {
        return
    }

    if (!['http:', 'https:'].includes(preloadLocation.protocol)) {
        return
    }

    if (preloadLocation.protocol == 'http:' && location.protocol == 'https:') {
        return
    }

    if (!allowQueryString && preloadLocation.search && !('instant' in linkElement.dataset)) {
        return
    }

    if (preloadLocation.hash && preloadLocation.pathname + preloadLocation.search == location.pathname + location.search) {
        return
    }

    if ('noInstant' in linkElement.dataset) {
        return
    }

    return true
}

function preload(url) {
    prefetcher.href = url
}

function stopPreloading() {
    prefetcher.removeAttribute('href')
}

const subscribe = document.querySelector('#subscribe-email')

if (subscribe) {
    subscribe.addEventListener('click', e => {
        e.preventDefault()
        e.target.parentNode.dataset.showEmail = true
    })
}

function renderOutline() {
    const navElement = document.querySelector('#pageNavItems')
    if (!navElement) {
        return;
    }

    const elements = document.querySelectorAll("h2");
    if (elements && elements.length > 0) {
        // 显示大纲
        document.querySelector('.page-nav').style.display = 'block';

        for (const element of elements) {
            const h2Title = element.innerText;

            // 创建大纲节点
            const a = document.createElement("a");
            a.setAttribute('class', 'item')
            a.setAttribute('href', "#" + h2Title);
            a.innerText = h2Title;
            navElement.appendChild(a);

            // 修改h2标题，增加锚点
            element.innerHTML = `
                <h2 class="Heading"><a class="Anchor" aria-hidden="true" id="${h2Title}" href="#${h2Title}">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    </a>${h2Title}
                </h2>
            `;
        }
    }
}

renderOutline();
