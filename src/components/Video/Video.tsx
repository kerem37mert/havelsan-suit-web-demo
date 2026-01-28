import classes from "./Video.module.css";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Circle, Layer, Stage } from "react-konva";

const Video = () => {
    const webcamRef = useRef<Webcam | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const [isShowLandmarks, setIsShowLandmarks] = useState(false);
    const [prediction, setPrediction] = useState<null | number>(null);

    type Landmark = {
        x: number;
        y: number;
        z: number;
    };
    const [landmarks, setLandmarks] = useState<Landmark[]>([])

    const predictValueList = [
        { valueInt: 0,  valueStr: "Uyanık", color:"green"},
        { valueInt: 5,  valueStr: "Düşük Uyanık", color:"orange"},
        { valueInt: 10,  valueStr: "Uykulu", color:"red"},
    ]

    useEffect(() => {
        let intervalId: number;

        wsRef.current = new WebSocket(import.meta.env.VITE_WS_URL);

        wsRef.current.onopen = () => {
            console.log('WebSocket bağlantısı kuruldu');

            intervalId = setInterval(() => {
                if (webcamRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
                    const imageSrc = webcamRef.current.getScreenshot();

                    if (imageSrc) {
                        wsRef.current.send(JSON.stringify({
                            type: 'frame',
                            data: imageSrc
                        }));
                    }
                }
            }, 100);
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setPrediction(data.prediction);
            setLandmarks(data.landmarks);
            console.log("Backend response:", data);
        };

        wsRef.current.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        wsRef.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return (
        <div className={ classes["video-container"] }>
            <div style={{
                position: "relative",
                display: "inline-block",
                width: 400,
                height: 300,
            }}>
                <Webcam
                    audio={ false }
                    mirrored={ true }
                    width={ 400 }
                    height={ 300 }
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{
                        display: "block",
                    }}
                />
                {isShowLandmarks && landmarks.length > 0 && (
                    <Stage
                        width={400}
                        height={300}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            pointerEvents: "none",
                        }}
                    >
                        <Layer>
                            {landmarks.map((lm, i) => (
                                <Circle
                                    key={i}
                                    x={lm.x * 400}
                                    y={lm.y * 300}
                                    radius={2}
                                    fill="white"
                                />
                            ))}
                        </Layer>
                    </Stage>
                )}
            </div>
            <div>
                <label>Show Landmarks</label>
                <input
                    type="checkbox"
                    checked={ isShowLandmarks }
                    onChange={ () => setIsShowLandmarks(prev => !prev) }
                />
            </div>
            {predictValueList.map(item => (
                item.valueInt === prediction && (
                    <div key={item.valueInt} style={{ color: item.color }}>
                        {item.valueStr}
                    </div>
                )
            ))}
        </div>
    );
}

export default Video;