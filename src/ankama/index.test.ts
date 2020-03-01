import SelectedServerDataMessage from "./SelectedServerDataMessage"

import SelectedServerDataExtendedMessage from "./SelectedServerDataExtendedMessage"

import GameServerInformations from "./GameServerInformations"
import { CustomDataWrapper } from "../network/CustomDataWraper"

test("pack unpack GameServerInformations", () => {
    let g1 = new GameServerInformations()
    g1.charactersCount = 4
    g1.charactersSlots = 5
    g1.completion = 65
    g1.date = 54545451
    g1.id = 254
    g1.isMonoAccount = false
    g1.isSelectable = true
    g1.status = 1
    g1.type = 1

    let bf: Buffer = g1.pack()
    let dataWrapper = new CustomDataWrapper(bf)
    let g2 = new GameServerInformations()
    g2.unpack(dataWrapper)

    expect(g1.charactersCount).toEqual(g2.charactersCount)
    expect(g1.charactersSlots).toEqual(g2.charactersSlots)
    expect(g1.completion).toEqual(g2.completion)
    expect(g1.date).toEqual(g2.date)
    expect(g1.id).toEqual(g2.id)
    expect(g1.isMonoAccount).toEqual(g2.isMonoAccount)
    expect(g1.isSelectable).toEqual(g2.isSelectable)
    expect(g1.status).toEqual(g2.status)
    expect(g1.type).toEqual(g2.type)

})


test("pack unpack SelectedServerDataMessage", () => {
    let slm = new SelectedServerDataMessage()
    slm.address = "thaethana"
    slm.canCreateNewCharacter = true
    slm.ports.push(5555, 443)
    slm.serverId = 229
    slm.tickets.push(80)
    slm.tickets.push(4)
    slm.tickets.push(47)
    slm.tickets.push(56)

    let bf: Buffer = slm.pack()

    let slm2 = new SelectedServerDataMessage()
    let d = slm2.unpack(bf, 0)
    expect(d).toBeTruthy()

    expect(slm.protocolId).toEqual(slm2.protocolId)
    expect(slm.address).toEqual(slm2.address)
    expect(slm.canCreateNewCharacter).toEqual(slm2.canCreateNewCharacter)
    expect(slm.ports).toEqual(slm2.ports)
    expect(slm.serverId).toEqual(slm2.serverId)
    expect(slm.tickets).toEqual(slm2.tickets)

})


test("pack unpack SelectedServerDataExtendedMessage", () => {
    let slm = new SelectedServerDataExtendedMessage()
    slm.address = "thaethana"
    slm.canCreateNewCharacter = true
    slm.ports.push(5555, 443)
    slm.serverId = 229
    slm.tickets.push(80)
    slm.tickets.push(4)
    slm.tickets.push(47)
    slm.tickets.push(56)


    let g1 = new GameServerInformations()
    g1.charactersCount = 4
    g1.charactersSlots = 5
    g1.completion = 65
    g1.date = 54545451
    g1.id = 254
    g1.isMonoAccount = false
    g1.isSelectable = true
    g1.status = 1
    g1.type = 1
    slm._servers.push(g1)


    let bf: Buffer = slm.pack()
    let slm2 = new SelectedServerDataExtendedMessage()
    slm2.unpack(bf, 0)

    expect(slm.protocolId).toEqual(slm2.protocolId)
    expect(slm.address).toEqual(slm2.address)
    expect(slm.canCreateNewCharacter).toEqual(slm2.canCreateNewCharacter)
    expect(slm.ports).toEqual(slm2.ports)
    expect(slm.serverId).toEqual(slm2.serverId)
    expect(slm.tickets).toEqual(slm2.tickets)

    expect(slm2._servers.length).toEqual(1)

    expect(slm._servers[0].charactersCount).toEqual(slm2._servers[0].charactersCount)
    expect(slm._servers[0].charactersSlots).toEqual(slm2._servers[0].charactersSlots)
    expect(slm._servers[0].completion).toEqual(slm2._servers[0].completion)
    expect(slm._servers[0].date).toEqual(slm2._servers[0].date)
    expect(slm._servers[0].id).toEqual(slm2._servers[0].id)
    expect(slm._servers[0].isMonoAccount).toEqual(slm2._servers[0].isMonoAccount)
    expect(slm._servers[0].isSelectable).toEqual(slm2._servers[0].isSelectable)
    expect(slm._servers[0].status).toEqual(slm2._servers[0].status)
    expect(slm._servers[0].type).toEqual(slm2._servers[0].type)
})


test("alter SelectedServerDataExtendedMessage", () => {
    let slm = new SelectedServerDataExtendedMessage()
    slm.address = "thaethana"
    slm.canCreateNewCharacter = true
    slm.ports.push(5555, 443)
    slm.serverId = 229
    slm.tickets.push(80)
    slm.tickets.push(4)
    slm.tickets.push(47)
    slm.tickets.push(56)


    let g1 = new GameServerInformations()
    g1.charactersCount = 4
    g1.charactersSlots = 5
    g1.completion = 65
    g1.date = 54545451
    g1.id = 254
    g1.isMonoAccount = false
    g1.isSelectable = true
    g1.status = 1
    g1.type = 1
    slm._servers.push(g1)

    slm.alterMsg()

    let bf: Buffer = slm.pack()
    let slm2 = new SelectedServerDataExtendedMessage()
    slm2.unpack(bf, 0)

    expect(slm.protocolId).toEqual(slm2.protocolId)
    expect(slm.address).toEqual("localhost")
    expect(slm.canCreateNewCharacter).toEqual(slm2.canCreateNewCharacter)
    expect(slm.ports).toEqual([7778])
    expect(slm.serverId).toEqual(slm2.serverId)
    expect(slm.tickets).toEqual(slm2.tickets)

    expect(slm2._servers.length).toEqual(1)

    expect(slm._servers[0].charactersCount).toEqual(slm2._servers[0].charactersCount)
    expect(slm._servers[0].charactersSlots).toEqual(slm2._servers[0].charactersSlots)
    expect(slm._servers[0].completion).toEqual(slm2._servers[0].completion)
    expect(slm._servers[0].date).toEqual(slm2._servers[0].date)
    expect(slm._servers[0].id).toEqual(slm2._servers[0].id)
    expect(slm._servers[0].isMonoAccount).toEqual(slm2._servers[0].isMonoAccount)
    expect(slm._servers[0].isSelectable).toEqual(slm2._servers[0].isSelectable)
    expect(slm._servers[0].status).toEqual(slm2._servers[0].status)
    expect(slm._servers[0].type).toEqual(slm2._servers[0].type)
})