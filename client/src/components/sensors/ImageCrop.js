import React, {useState, useRef, useEffect} from 'react'

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
} from 'react-image-crop'

import 'react-image-crop/dist/ReactCrop.css'

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
    mediaWidth,
    mediaHeight
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 60,
            },
            16 / 9,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}


function canvasPreview(
    image,
    canvas,
    crop,
    scale = 1,
    rotate = 0,
) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
        throw new Error('No 2d context')
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'

    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY

    const rotateRads = rotate * (Math.PI / 180)
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2

    ctx.save()

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY)
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY)
    // 3) Rotate around the origin
    ctx.rotate(rotateRads)
    // 2) Scale the image
    ctx.scale(scale, scale)
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY)
    ctx.drawImage(
        image,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
        0,
        0,
        image.naturalWidth,
        image.naturalHeight,
    )

    ctx.restore();
}

const deltaValue = (v, d, decimalRounding = 0) => Math.round(Math.pow(10, decimalRounding) * (v + d)) / Math.pow(10, decimalRounding);

export default function ImageCrop({imgSrc, onCrop}) {
    const previewCanvasRef = useRef(null)
    const imgRef = useRef(null)
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const [isShowCropPreview, setShowCropPreview] = useState(false);

    function onImageLoad(e) {
        const {width, height} = e.currentTarget
        setCrop(centerAspectCrop(width, height))
    }

    useEffect(() => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                );
                onCrop(previewCanvasRef.current.toDataURL('image/jpeg', .7));
            }
        },
        [completedCrop, scale, rotate]
    )

    return (
        <section>
            <div>
                Scale:
                <button className='number-control' type='button'
                        onClick={() => setScale(s => Math.max(.1, deltaValue(s, -0.1, 1)))}>-</button>
                {scale}
                <button className='number-control' type='button'
                        onClick={() => setScale(s => Math.min(3, deltaValue(s, 0.1, 1)))}>+</button>
            </div>
            <div>
                Rotate:
                <button className='number-control' type='button'
                        onClick={() => setRotate(r => Math.max(-180, deltaValue(r, -1)))}>-</button>
                {rotate}
                <button className='number-control' type='button'
                        onClick={() => setRotate(r => Math.min(180, deltaValue(r, 1)))}>+</button>

            </div>
            <div>
                <label><input type='checkbox' onChange={e => setShowCropPreview(Boolean(e.currentTarget.checked))}/> Show crop preview </label>
            </div>
            {Boolean(imgSrc) && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        style={{
                            transform: `scale(${scale}) rotate(${rotate}deg)`,
                            maxHeight: '90vh',
                            maxWidth: '90%'
                        }}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            )}
            {Boolean(completedCrop) &&
                <div style={{display: isShowCropPreview ? '': 'none'}}>
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: completedCrop.width,
                            height: completedCrop.height,
                        }}
                    />
                </div>
            }

        </section>
    )
}
