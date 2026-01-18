import type { HeaderProps } from "./Header.types";
import classes from "./Header.module.css";

const Header = ({ title }: HeaderProps) => {
    return (
        <div className={ classes.header }>
            <div className={ classes.title }>{ title }</div>
        </div>
    );
}

export default Header;