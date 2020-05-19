export type Action = {
    type: string,
    payload: any
}
export type MsgAction = {
    protocolId: number,
    typeName: string,
    alter: Function | null,
    doInBackground: Function | null,
}



type Groupe = {
    partyId: number
    members: Actor[]

    partyType: number
    partyLeaderId: number
    maxParticipants: number
    guests: Array<any>
    restricted: number
    partyName: number
}
type Object = {
    position: number
    objectGID: number
    objectUID: number
    quantity: number
    effects: [
        {
            actionId: number
            value: number
        }
    ]
}
type inventory = {
    kamas: number
    objects: Object[]
}
export type Character = {
    id: number
    name: string
    allianceId: number
    allianceTag: string
    allianceName: string
    level: number
    sex: boolean
    inventory: inventory
    isMyTurn: boolean
    inFight: boolean
    inFightPreparation: boolean
    isReady: boolean
    groupe: Groupe
    partyUpdates: []
}
type Actor = {
    contextualId: number
    cellId: number
    direction: number
    bonesId: number
    subentities: []
    name: string
    cantBeAggressed: boolean
    cantBeChallenged: boolean
    cantTrade: boolean
    cantBeAttackedByMutant: boolean
    cantRun: boolean
    forceSlowWalk: boolean
    cantMinimize: boolean
    cantMove: boolean
    sex: boolean
    accountId: number
    alignmentSide: number
    alignmentValue: number
    alignmentGrade: number
    characterPower: number
    options: []
}
type TeamMember = {
    id: number
    name: string
    level: number
}
type FightTeam = {
    teamId: number
    leaderId: number
    teamSide: number
    teamTypeId: number
    nbWaves: number
    teamMembers: TeamMember[]
}
type Fight = {
    fightId: number
    fightType: number
    fightTeams: FightTeam[]
    fightTeamsPositions: []
    fightTeamsOptions: []
}
export type Map = {
    subAreaId: number
    mapId: number
    obstacles: []
    fights: Fight[]
    fightCount: number
    //runningFights:any
    updateTeam: any
    hasAggressiveMonsters: boolean
    actors: Actor[]
    players: Actor[]
    monsters: Actor[]
    statedElements: []
    interactiveElements: []
}
export type CharacterState = {
    [key: number]: Character
}
export type MapState = {
    [key: number]: Map
}
export type State = {
    character: CharacterState
    map: MapState
}