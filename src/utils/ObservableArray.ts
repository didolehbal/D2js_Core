
export function ObservableArrayFactory<T>() : ObservableArray<T> {
    let array = new Array<T>();

    type ArrayEvent = "push" | "remove"

    let onPush: Function
    let onRemove: Function

    function push(el: T) {
        array.push(el)
        if (onPush) {
            onPush(el)
        }
    }

    function remove(el: T) {
        const index = array.indexOf(el);
        if (index > -1) {
            array.splice(index, 1);
            if (onRemove) {
                onRemove(el)
            }
        }else console.error("Ovservable el not found")
        
    }

    function on(evt: ArrayEvent, cb: Function) {
        switch (evt) {
            case "push":
                onPush = cb;
                break;
            case "remove":
                onRemove = cb;
                break;
        }
    }

    return {
        items: array, on, push, remove
    }
}

export type ObservableArray<T> ={
    items:T[],
    on:Function,
    push:Function,
    remove:Function
}