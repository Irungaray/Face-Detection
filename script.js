const video = document.getElementById('video')

const WEIGHTS_URL = "http://localhost:8080/";

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(WEIGHTS_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(WEIGHTS_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(WEIGHTS_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(WEIGHTS_URL)
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    }, 100)
})
