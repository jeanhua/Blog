if (document.getElementById("vst000001") == null) {
    let stylesheet = document.createElement("link")
    stylesheet.rel = "stylesheet"
    stylesheet.id = "vst000001"
    stylesheet.href = "https://cdn.bootcdn.net/ajax/libs/viewerjs/1.10.0/viewer.min.css"
    document.head.appendChild(stylesheet)

}
if (document.getElementById("vsc000001") == null) {
    let script = document.createElement("script")
    script.id = "vsc000001"
    script.src = "https://cdn.bootcdn.net/ajax/libs/viewerjs/1.10.0/viewer.min.js"
    script.onload = () => {
        new Viewer(document.getElementById('post-body'), {
            button: true,
            inline: false,
            zoomable: true,
            title: false,
            tooltip: false,
            toolbar: false,
            movable: true,
            interval: 1000,
            navbar: false,
            loading: true,
        });
    }
    document.head.appendChild(script)
} else {
    new Viewer(document.getElementById('post-body'), {
        button: true,
        inline: false,
        zoomable: true,
        title: false,
        tooltip: false,
        toolbar: false,
        minZoomRatio: 0.5,
        maxZoomRatio: 100,
        movable: true,
        interval: 1000,
        navbar: false,
        loading: true,
    });
}