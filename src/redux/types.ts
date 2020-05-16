export type Action = {
    type: string,
    payload: any
}
export type MsgAction = {
    protocolId: number,
    typeName:string,
    alter: Function | null,
    doInBackground:Function | null,
}
