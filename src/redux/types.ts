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
    isSpectator:boolean
    isReady: boolean
    groupe: Groupe
    partyUpdates: Array<any>
    koli:Koli
    isAgressable:boolean

}

type Koli = {
    invitedToKoli:string,
    results : [{
        name:string,
        online : boolean
    }]
}
type Actor = {
    contextualId: number
    cellId: number
    direction: number
    bonesId: number
    subentities: Array<any>
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
    level:number
    options : Array<any>
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
    fightTeamsPositions : Array<any>
    fightTeamsOptions : Array<any>
}
export type Map = {
    subAreaId: number
    mapId: number
    obstacles : Array<any>
    fights: Fight[]
    fightCount: number
    //runningFights:any
    updateTeam: any
    hasAggressiveMonsters: boolean
    actors: Actor[]
    players: Actor[]
    monsters: Actor[]
    statedElements : Array<any>
    interactiveElements : Array<any>
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