import { useEffect, useRef } from 'preact/hooks';
import { Gif } from '../util/loadGif';

/**
 * Draws a gif using a canvas.
 */
export function GifCanvas(props: {
    gif: Gif,
    frame: number,
    zoom: number,
    style?: any,
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const frame = props.gif.frames[props.frame];
        if (!frame) {
            return;
        }

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = false;
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(props.zoom, props.zoom);
            ctx.drawImage(frame.canvas, 0, 0);
        }
    }, [props.gif, props.frame, props.zoom]);

    return <canvas
        ref={canvasRef}
        style={props.style}
        width={props.gif.width * props.zoom}
        height={props.gif.height * props.zoom} />;
}
