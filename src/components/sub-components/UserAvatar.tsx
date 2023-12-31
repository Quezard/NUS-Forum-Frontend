import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

// helper functions to style UserAvatar
function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string, fontSize: number) {
    const names = name.split(" ");
    // create initials
    let initials: string = "";
    let i = 0;
    while (i < names.length && initials.length < 2) {
        const char = names[i];
        if (char) {
            initials += char[0].toUpperCase();
        }
        i++;
    }

    return {
        sx: {
            bgcolor: stringToColor(name),
            fontSize: `${fontSize}px`,
            width: 2 * fontSize,
            height: 2 * fontSize,
        },
        children: initials,
    };
}

// props for UserAvatar
type UserAvatarProps = {
    userID: number;
    username: string;
    fontSize?: number;
};

const UserAvatar: React.FC<UserAvatarProps> = ({ userID, username, fontSize }) => {
    const navigate = useNavigate();

    function handleAvatarClick() {
        navigate(`/user/${userID}`);
    }

    // get initial of name
    return <Avatar {...stringAvatar(username, fontSize!)} onClick={handleAvatarClick} />;
};

UserAvatar.defaultProps = {
    fontSize: 20,
};

export default UserAvatar;
