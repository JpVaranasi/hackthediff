export type Club = {
    id:number
    name:string
    lat:number
    long:number
    tags:string[]
    training_days:string[]
}

export const clubs:Club[]=[
    {
        id:1,
        name:"Cardiff RFC",
        lat:51.4816,
        long:-3.1791,
        tags:["play","inclusive"],
        training_days:["Tuesday,Thursday"],
    },
    {
        id:2,
        name:"Penarth RFC",
        lat:51.4816,
        long:-3.1791,
        tags:["play","volunteer"],
        training_days:["Monday,Thursday"],
    },
    {
        id:3,
        name:"Newport RFC",
        lat:51.4816,
        long:-3.1791,
        tags:["play","inclusive"],
        training_days:["Tuesday,Thursday"],
    }
]