import { getTypesFromName } from "../../utils/Protocol"
import characterActions from "./character"
import mapActions from "./map"
export type MsgAction = {
  protocolId: number,
  typeName: string,
  alter: Function | null,
  doInBackground: Function | null,
}

export const actionsFactory = (client_id: number, store: any): { serverActions: MsgAction[], clientActions: MsgAction[] } => ({
  serverActions: [
    ...characterActions(client_id, store).serverActions,
    ...mapActions(client_id, store).serverActions
  ],
  clientActions: [
    ...characterActions(client_id, store).clientActions,
    ...mapActions(client_id, store).clientActions
  ]
})

export function Action(name: string, client_id: number, store: any): MsgAction {
  let msgType = getTypesFromName[name]
  if (!msgType)
    throw new Error("msg type not found")
  return {
    protocolId: msgType.protocolId,
    typeName: msgType.name,
    doInBackground: (data: any) => {
      store.dispatch({ type: msgType.name, payload: { data, client_id } })
    },
    alter: null
  }
}