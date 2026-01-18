import classes from "./Video.module.css";
import Webcam from "react-webcam";

const Video = () => {
    return (
        <div className={ classes["video-container"] }>
            <Webcam
                audio={false}
                width={400}
                height={300}
                screenshotFormat="image/jpeg"
            />
        </div>
    );
}

export default Video;