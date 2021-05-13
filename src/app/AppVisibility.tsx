import React from "react";
import { useDispatch } from "react-redux";
import KeyValueActions from "../redux/key-value/actions";
import { KeyValueKeys } from "../redux/key-value/types";

const handleHidden = (cb: (isHidden: boolean) => void) => {
    let hidden = "hidden";

    // Standards:
    if (hidden in document) {
        document.addEventListener("visibilitychange", onchange);
    } else if ((hidden = "mozHidden") in document) {
        document.addEventListener("mozvisibilitychange", onchange);
    } else if ((hidden = "webkitHidden") in document) {
        document.addEventListener("webkitvisibilitychange", onchange);
    } else if ((hidden = "msHidden") in document) {
        document.addEventListener("msvisibilitychange", onchange);
    } else if ("onfocusin" in document) {
        // IE 9 and lower:
        // @ts-ignore
        document.onfocusin = document.onfocusout = onchange;
    } else {
        // All others:
        window.onpageshow =
            window.onpagehide =
            window.onfocus =
            window.onblur =
                onchange;
    }

    function onchange(evt: Event) {
        let state;
        const appVisible = "visible";
        const appHidden = "hidden";
        const evtMap = {
            focus: appVisible,
            focusin: appVisible,
            pageshow: appVisible,
            blur: appHidden,
            focusout: appHidden,
            pagehide: appHidden,
        };

        evt = evt || window.event;
        if (evt.type in evtMap) {
            // @ts-ignore
            state = evtMap[evt.type];
        } else {
            // @ts-ignore
            state = this[hidden] ? "hidden" : "visible";
        }

        if (state === appVisible) {
            cb(false);
        } else {
            cb(true);
        }
    }

    // set the initial state (but only if browser supports the Page Visibility API)
    // @ts-ignore
    if (document[hidden] !== undefined) {
        // TODO: wouldn't it be better if we don't connect at all
        //   if the page is hidden

        // @ts-ignore
        onchange({ type: document[hidden] ? "blur" : "focus" });
    }
};

const AppVisibility: React.FC<{}> = (props) => {
    const dispatch = useDispatch();
    const updateAppVisibity = React.useCallback(
        (isAppHidden: boolean) => {
            dispatch(
                KeyValueActions.setKey({
                    key: KeyValueKeys.IsAppHidden,
                    value: isAppHidden,
                })
            );
        },
        [dispatch]
    );

    React.useEffect(() => {
        handleHidden(updateAppVisibity);
    }, [updateAppVisibity]);

    return null;
};

export default AppVisibility;
